import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { restrictTo } from '../server/middleware/roles.js';

test('Password Hashing with bcryptjs', async () => {
  const plainPassword = 'TestPassword@123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plainPassword, salt);

  assert.notEqual(hash, plainPassword);
  assert.equal(typeof hash, 'string');
  assert.equal(hash.startsWith('$2'), true);

  const isMatch = await bcrypt.compare(plainPassword, hash);
  assert.equal(isMatch, true);

  const wrongMatch = await bcrypt.compare('WrongPassword', hash);
  assert.equal(wrongMatch, false);
});

test('JWT Signing and Verification', () => {
  const secret = 'test_secret_key_123';
  const payload = { id: 'user_12345', role: 'STUDENT', email: 'student@college.edu' };

  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  assert.equal(typeof token, 'string');

  const decoded = jwt.verify(token, secret);
  assert.equal(decoded.id, 'user_12345');
  assert.equal(decoded.role, 'STUDENT');
  assert.equal(decoded.email, 'student@college.edu');

  assert.throws(() => {
    jwt.verify(token, 'wrong_secret');
  });
});

test('RBAC Middleware - restrictTo restricts unauthorized roles', () => {
  const adminOnly = restrictTo('ADMIN');

  // Case 1: Student trying to access Admin route
  let statusSent = null;
  let jsonSent = null;

  const reqStudent = {
    user: { id: 's1', role: 'STUDENT', name: 'Student One' }
  };
  const res = {
    status: (s) => {
      statusSent = s;
      return {
        json: (j) => { jsonSent = j; }
      };
    }
  };
  let nextCalled = false;
  const next = () => { nextCalled = true; };

  adminOnly(reqStudent, res, next);
  assert.equal(statusSent, 403);
  assert.equal(jsonSent.code, 'FORBIDDEN_ROLE');
  assert.equal(nextCalled, false);

  // Case 2: Admin accessing Admin route
  statusSent = null;
  jsonSent = null;
  nextCalled = false;

  const reqAdmin = {
    user: { id: 'a1', role: 'ADMIN', name: 'Admin One' }
  };

  adminOnly(reqAdmin, res, next);
  assert.equal(nextCalled, true);
  assert.equal(statusSent, null);
});

test('RBAC Middleware - blocks unauthenticated requests', () => {
  const adminOnly = restrictTo('ADMIN');
  let statusSent = null;
  let jsonSent = null;
  let nextCalled = false;

  const reqNoUser = {};
  const res = {
    status: (s) => {
      statusSent = s;
      return {
        json: (j) => { jsonSent = j; }
      };
    }
  };
  const next = () => { nextCalled = true; };

  adminOnly(reqNoUser, res, next);
  assert.equal(statusSent, 401);
  assert.equal(jsonSent.code, 'UNAUTHENTICATED');
  assert.equal(nextCalled, false);
});
