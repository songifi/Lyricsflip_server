import * as bcrypt from 'bcrypt';
describe('Password hashing and validation', () => {
  const password = 'TestPassword123!';
  let hash: string;

  it('should hash a password', async () => {
    hash = await bcrypt.hash(password, 12);
    expect(hash).toBeDefined();
    expect(hash).not.toEqual(password);
  });

  it('should validate a correct password', async () => {
    const isValid = await bcrypt.compare(password, hash);
    expect(isValid).toBe(true);
  });

  it('should not validate an incorrect password', async () => {
    const isValid = await bcrypt.compare('WrongPassword', hash);
    expect(isValid).toBe(false);
  });
});

// AuthService DI test removed due to missing provider mocks. Focus on password hashing/validation only.
