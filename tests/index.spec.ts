import { createKeyGen } from "../src";

test("createKeyGen", () => {
  expect(() => {

    const keygen = createKeyGen({
        algorithm: "RSA",
        bits: 2048,
        private: "SHqphqqk10w3aJDHhIMkAj/FYY5R1cr6X/fQn7fVKcdVxgd+DpMrtmYi4zeOlQGB0x5Rj9JBftC65cmPUO98gSCQiqwhV9BL1P39cw4vORAA0MH+0EMTQJC/Nqfoi1iw1x4mojOCemFAqHckO2u2hksg/fcf1p/OhL/LI2ZkjsBEb502L4Okr+30rXtDWaHKdoN+Ey/wM8woN5RHmVkx44HW+aCqfGu+sDJw/juvWETV3WblEV07HBXwfvQu19L85JIeTM27+TVd57lzdhKdyuel156KHYu8lGbRLDQW4XE+G+RwhEeCN0SA70qiy1yFOUwwUCsZ2ytpyZshJFmHaQ==",
        modulus: "tZy2ayOS55H48Nwv7wjN6OsPbcRs63aeunCfz4kHMLL+tinVe4E2K9kOoF4jGsVAf3pOJa5m9Wbqe0+secmnEvMqOhZgBI696mMEir+R0jSAJj01byOw/UTp7DNRxRHnWjlQoCZB4/INgSDnVJhvSZJPlea+3BXHfZwky1PF/Tcg7XIiLQEQguaIShoxsOAo6wTmQ1bfXx2DyBc9La2SBqMj5+C4uU6958N81MUkVixRpiLTfMdZBxJu215NslLuQI82FyoD8T+57l9UvdEwsq24Bw9IeNbe781J0eFVJgcaNBiOaon18Xb1jzgLCdMLU5lyzACjdPX5Fb2j5Uvhzw==",
        productCode: "XgdTzLalxNk=",
    });

    const serial = keygen({
        userName: "exampleUser",
        email: "admin@example.com",
        expDate: new Date("2021-09-09T00:00:00.000Z"),
        maxBuildDate: new Date("2022-09-09T00:00:00.000Z"),
        runningTimeLimit: 200,
        hardwardId: Buffer.from("WHG7lHA5Ap92fAbCccZWiQ==", "base64"),
        userData: Buffer.from("testdata"),
    });

    console.log(serial);
  }).not.toThrow();
})