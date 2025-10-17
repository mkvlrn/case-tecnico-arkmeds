export const getDriverById = {
  success: {
    output: {
      id: "okmclejrj1xegofrbc164ie0",
      name: "Test Driver 1",
      cpf: "11550065009",
      gender: "male",
      dateOfBirth: "1999-01-01",
      address: "Test Address 1",
      phone: "+5511999999901",
      vehicle: "Test Vehicle 1",
    },
  },

  fail: {
    error: {
      code: "resourceNotFound",
      message: "driver with id very-wrong-id not found",
    },
  },
};
