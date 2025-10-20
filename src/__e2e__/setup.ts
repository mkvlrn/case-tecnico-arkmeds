import { execSync } from "node:child_process";
import process from "node:process";
import type { Gender, PrismaClient } from "@/generated/prisma/client";

const cuidCpfGender = [
  ["okmclejrj1xegofrbc164ie0", "11550065009", "male"],
  ["rzy36faywczj21xwrya83c7p", "72935930070", "female"],
  ["bekjit8nanc8jrv0oa0bn0og", "49839418009", "other"],
  ["p8ibh0k2cgl188eryv9zcota", "54082179062", "undisclosed"],
  ["v3bemokjn5dh31wf2rkydn4z", "17423972045", "male"],
  ["jyauacup17kjg5xrmj47a8en", "87992915097", "female"],
  ["cf4abhjd8cutpampxm3leq8x", "56273319090", "other"],
  ["o6ja32e151c0k48oyci1c5zw", "59975120024", "undisclosed"],
  ["f5zz51ftmmz19xjajxlshh1s", "01797682040", "male"],
  ["qvs6fgnonakmc1h71ivcqqka", "95574589095", "female"],
  ["quf8c8juog00h0r0og2axiax", "00884367053", "other"],
  ["e8xbud9nwniqah2l49f1tf7o", "14924153087", "undisclosed"],
] satisfies [string, string, Gender][];

export async function seed(prisma: PrismaClient) {
  await prisma.driver.createMany({
    data: cuidCpfGender.map(([cuid, cpf, gender], index) => ({
      id: cuid,
      name: `Test Driver ${index + 1}`,
      cpf,
      gender,
      address: `Test Address ${index + 1}`,
      phone: `+55119999999${(index + 1).toString().padStart(2, "0")}`,
      dateOfBirth: new Date(`1999-01-${(index + 1).toString().padStart(2, "0")}`),
      vehicle: `Test Vehicle ${index + 1}`,
    })),
  });

  await prisma.passenger.createMany({
    data: cuidCpfGender.map(([cuid, cpf, gender], index) => ({
      id: cuid,
      name: `Test Passenger ${index + 1}`,
      cpf,
      gender,
      address: `Test Address ${index + 1 + 10}`,
      phone: `+55219999999${(index + 1).toString().padStart(2, "0")}`,
      dateOfBirth: new Date(`1999-01-${(index + 1).toString().padStart(2, "0")}`),
      prefersNoConversation: true,
    })),
  });
}

export function init(url: string) {
  execSync("prisma migrate deploy", { env: { ...process.env, DATABASE_URL: url } });
}

export function destroy(url: string) {
  execSync("prisma migrate reset --force", { env: { ...process.env, DATABASE_URL: url } });
}

export async function clearDrivers(prisma: PrismaClient) {
  await prisma.driver.deleteMany({});
}
