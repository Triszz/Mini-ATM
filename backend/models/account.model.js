const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const AccountSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    pin: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      unique: true,
    },
    isBalanceHide: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// instance methods
AccountSchema.methods.isValidPin = async function (pin) {
  if (!pin) {
    throw Error("PIN is required!");
  }
  const correctPin = await bcrypt.compare(pin, this.pin);
  if (!correctPin) {
    throw Error("Incorrect PIN! Please try again.");
  }
  return true;
};

AccountSchema.methods.getBalance = function () {
  return this.balance;
};

AccountSchema.methods.getUsername = function () {
  return this.username;
};

AccountSchema.methods.withdraw = async function (amount, pin) {
  await this.isValidPin(pin);
  if (this.balance < amount) {
    throw Error("Insufficient funds");
  }
  this.balance -= amount;
  return this.balance;
};

AccountSchema.methods.transfer = async function (
  receiverAccountNumber,
  amount,
  pin
) {
  await this.isValidPin(pin);
  const receiver = await mongoose
    .model("Account")
    .findOne({ accountNumber: receiverAccountNumber });
  if (!receiver) {
    throw Error("Receiver account is not found!");
  }
  if (this.balance < amount) {
    throw Error("Insufficient funds");
  }
  receiver.balance += amount;
  await receiver.save();
  this.balance -= amount;
  await this.save();
  return { senderBalance: this.balance, receiverBalance: receiver.balance };
};
AccountSchema.methods.deposit = async function (amount, pin) {
  await this.isValidPin(pin);
  this.balance += amount;
  return this.balance;
};
// statics function
AccountSchema.statics.signup = async function (data) {
  // validation
  if (!data.email || !data.password || !data.username || !data.pin) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(data.email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(data.password)) {
    throw Error("Password is not strong enough");
  }
  if (!/^\d{4,6}$/.test(data.pin)) {
    throw Error("PIN must be 4-6 digits");
  }
  const existingEmail = await this.findOne({ email: data.email });
  if (existingEmail) {
    throw Error("Email already exists, please try another email!");
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(data.password, salt);
  const hashPin = await bcrypt.hash(data.pin, salt);
  const account = await this.create({
    email: data.email,
    password: hashPassword,
    username: data.username,
    pin: hashPin,
  });
  return account;
};

AccountSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  const account = await this.findOne({ email });
  if (!account) {
    throw Error("Incorrect email or password!");
  }

  const correctPassword = await bcrypt.compare(password, account.password);
  if (!correctPassword) {
    throw Error("Incorrect email or password!");
  }
  return account;
};

// pre-middleware
function generateAccountNumber() {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
}

AccountSchema.pre("save", async function (next) {
  if (!this.accountNumber) {
    let accountNumber;
    let isUnique = false;
    while (!isUnique) {
      accountNumber = generateAccountNumber();
      const existing = await mongoose
        .model("Account")
        .findOne({ accountNumber });
      if (!existing) isUnique = true;
    }
    this.accountNumber = accountNumber;
  }
  next();
});

const Account = mongoose.model("Account", AccountSchema);
module.exports = Account;
