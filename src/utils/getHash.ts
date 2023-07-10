import bcrypt from "bcrypt";

export default async function getHash(val: string | Buffer) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(val, salt);
}
