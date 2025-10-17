export const getPassengerById = {
  success: {
    output: {
      id: "okmclejrj1xegofrbc164ie0",
      name: "Test Passenger 1",
      cpf: "11550065009",
      gender: "male",
      dateOfBirth: "1999-01-01",
      address: "Test Address 11",
      phone: "+5521999999901",
      prefersNoConversation: true,
    },
  },

  fail: {
    error: {
      code: "resourceNotFound",
      message: "passenger with id very-wrong-id not found",
    },
  },
};
