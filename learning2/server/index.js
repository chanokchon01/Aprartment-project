const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const http = require("http");
const { Server } = require("socket.io");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");

global.usermm = "";

/*var imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}.${file.originalname}`);
  },
});

const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(null, Error("only image is allowd"));
  }
};

app.post("/register", upload.single("photo"), (req, res) => {
  console.log(req.file);
});

var upload = multer({
  storage: imgconfig,
  fileFilter: isImage,
});*/

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room:${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {});
});

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-acess-token"];

  if (!token) {
    res.send("no token give me next time");
  } else {
    jwt.verify(token, "jwtSecret", (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "U failed to authen" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["get", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "test2",
});
app.post("/Roomonload", (req, res) => {
  usermm = req.body.usermm;
  res.send("");
});
app.post("/usersonload", (req, res) => {
  usermm = req.body.usermm;
  res.send("");
});
app.post("/Roommanagesonload", (req, res) => {
  usermm = req.body.usermm;
  res.send("");
});
app.post("/personaonload", (req, res) => {
  usermm = req.body.usermm;
  res.send("");
});
app.post("/NotifyingMoneyTransferonload", (req, res) => {
  usermm = req.body.usermm;
  res.send("");
});
app.post("/Meteronload", (req, res) => {
  usermm = req.body.usermm;
  res.send("");
});
app.post("/Billonload", (req, res) => {
  usermm = req.body.usermm;
  res.send("");
});
app.post("/invoiceonload", (req, res) => {
  usermm = req.body.usermm;
  res.send("");
});
app.post("/paymentonload", (req, res) => {
  usermm = req.body.usermm;
  res.send("");
});
app.post("/packagecuonload", (req, res) => {
  usermm = req.body.usermm;
  res.send("");
});
app.post("/persononload", (req, res) => {
  usermm = req.body.usermm;
  res.send("");
});

app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employees", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/roomdata", (req, res) => {
  db.query("SELECT * FROM room", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/contractdata", (req, res) => {
  db.query(
    "SELECT * FROM rent_room WHERE Customer_id = (SELECT ID_customer FROM customer WHERE username = ? ) AND Rent_status = 'เช่า'",
    usermm,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/usertest", (req, res) => {
  db.query(
    "SELECT password FROM users WHERE username = ?",
    usermm,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ username: "wmmm", usermm: usermm });
      } else {
        res.send(result);
        res.send("Values Inserted");
      }
    }
  );
});

app.post("/contract", (req, res) => {
  const username = req.body.username;
  const room_number = req.body.room_number;

  db.query(
    "INSERT INTO rent_room (Customer_id,Room_id,Date_start,Rent_status,customer_username,room_number) VALUES ((SELECT ID_customer FROM customer WHERE username = ?),(SELECT ID_room FROM `room` WHERE Room_number = ?),(SELECT CURDATE() AS Today),('เช่า'),?,?)",
    [username, room_number, username, room_number],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Contract Inserted");
      }
    }
  );
});

app.post("/updateroomA", (req, res) => {
  const room_update = req.body.room_update;

  db.query(
    "UPDATE `room` SET `Room_status` = 'เช่า' WHERE `Room_number` = ?",
    room_update,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Contract Inserted");
      }
    }
  );
});

app.post("/updatedelete", (req, res) => {
  const roomDelete = req.body.room;

  db.query(
    "UPDATE `room` SET `Room_status` = 'คืนห้อง' WHERE `ID_room` = (SELECT Room_id FROM rent_room WHERE ID_rent = ? )",
    roomDelete,
    (err, result) => {
      if (err) {
      } else {
        res.send("Contract Inserted");
      }
    }
  );
});

app.post("/deletecontract", (req, res) => {
  const username = req.body.username;
  const room = req.body.room;

  db.query(
    "UPDATE `rent_room` SET `Rent_status` = 'คืนห้อง'  WHERE ID_rent = ? AND Customer_id =(SELECT ID_customer FROM customer WHERE username = ?)",
    [room, username],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Contract Inserted");
      }
    }
  );
});

app.get("/unitshow", (req, res) => {
  db.query("SELECT * FROM meter_unit", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/invoiceshow", (req, res) => {
  db.query(
    "SELECT * FROM invoice WHERE Invoice_status = 'รอชำระ' or Invoice_status = 'รอตรวจสอบ'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/invoicedata", (req, res) => {
  db.query(
    "SELECT * FROM invoice WHERE Room_number in (SELECT room_number FROM rent_room WHERE customer_username = ?) AND (Invoice_status = 'รอชำระ' or Invoice_status = 'รอตรวจสอบ');",
    usermm,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/updateinvoice", (req, res) => {
  const invoice = req.body.invoice;

  db.query(
    "UPDATE `invoice` SET `Invoice_status` = 'รอตรวจสอบ' WHERE `ID_invoice` = ?",
    invoice,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Contract Inserted");
      }
    }
  );
});

app.post("/updateconfirm", (req, res) => {
  const status = req.body.status;
  const Invoice_id = req.body.Invoice_id;

  db.query(
    "UPDATE `invoice` SET `Invoice_status` = ? WHERE `ID_invoice` = ?",
    [status, Invoice_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Contract Inserted");
      }
    }
  );
});
app.post("/updateconfirmB", (req, res) => {
  const ID_payment = req.body.ID_payment;

  db.query(
    "UPDATE `payment` SET `payment_status` = 'ตรวจสอบแล้ว' WHERE `ID_payment` = ?",
    [ID_payment],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Contract Inserted");
      }
    }
  );
});

app.get("/paymentdata", (req, res) => {
  db.query(
    "SELECT * FROM payment WHERE payment_status = 'รอตรวจสอบ'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/testA", (req, res) => {
  const username = req.body.username;

  db.query(
    "SELECT * FROM customer WHERE username = ?",
    username,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/roomdatacheck", (req, res) => {
  const room_number = req.body.room_number;

  db.query(
    "SELECT * FROM room WHERE Room_number = ? AND Room_status = 'ว่าง'",
    room_number,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/roomdatacheckB", (req, res) => {
  const usercheck = req.body.usercheck;

  db.query(
    "SELECT * FROM customer WHERE username = ? ",
    usercheck,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/deletecontractcheckA", (req, res) => {
  const username = req.body.username;
  const room = req.body.room;

  db.query(
    "SELECT * FROM rent_room WHERE ID_rent = ? AND Customer_id = (SELECT ID_customer FROM customer WHERE username = ?) ",
    [room, username],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/create", (req, res) => {
  const name = req.body.name;
  const lastname = req.body.lastname;
  const phone = req.body.phone;

  db.query(
    "INSERT INTO employees (name, lastname, phone) VALUES (?,?,?)",
    [name, lastname, phone],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const name = req.body.name;
  const lastname = req.body.lastname;
  const phone = req.body.phone;
  const email = req.body.email;
  const idcard = req.body.idcard;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "INSERT INTO customer (Name,Lastname,Phone,Email,idcard, Password,username) VALUES (?,?,?,?,?,?,?)",
      [name, lastname, phone, email, idcard, hash, username],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  });
});

app.post("/registerM", (req, res) => {
  const username = req.body.username;
  const name = req.body.name;
  const lastname = req.body.lastname;
  const phone = req.body.phone;
  const email = req.body.email;
  const idcard = req.body.idcard;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "INSERT INTO manager (Name,Lastname,Phone,Email,idcard, Password,username) VALUES (?,?,?,?,?,?,?)",
      [name, lastname, phone, email, idcard, hash, username],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  });
});

app.post("/cre_invoice", (req, res) => {
  const room = req.body.room;
  const Electric_unit = req.body.Electric_unit;
  const Water_unit = req.body.Water_unit;

  db.query(
    "INSERT INTO invoice (Date_day,Date_month,Date_year,Total_price,Room_number,Electric_meter,Water_meter,Invoice_status) VALUES((SELECT DAY(CURDATE())),(SELECT MONTHNAME(CURDATE())),(SELECT YEAR(CURDATE())),((SELECT Price FROM room WHERE Room_number = ?)+((SELECT Electric_unit from meter_unit where ID_meter = 1)*?)+((SELECT Water_unit from meter_unit where ID_meter = 1)*?)),?,?,?,'รอชำระ')",
    [room, Electric_unit, Water_unit, room, Electric_unit, Water_unit],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.post("/payment", (req, res) => {
  const Date = req.body.Date;
  const invoice = req.body.invoice;
  const total = req.body.total;
  const name = req.body.name;
  const room = req.body.room;
  const time = req.body.time;

  db.query(
    "INSERT INTO payment (Invoice_id,Date_day_pay,Room_Number_pay,total,name,time_,payment_status) VALUES(?,?,?,?,?,?,'รอตรวจสอบ')",
    [invoice, Date, room, total, name, time],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.get("/isUserAuth", verifyJWT, (req, res) => {
  console.log("hello weada");
  res.send(usermm);
});

app.get("/loginR", (req, res) => {
  if (req.session.user) {
    res.send({ LoggedIn: true, user: req.session.user });
  } else {
    res.send({ LoggedIn: false });
  }
});

app.get("/loginM", (req, res) => {
  if (req.session.user) {
    res.send({ LoggedIn: true, user: req.session.user });
  } else {
    res.send({ LoggedIn: false });
  }
});

app.post("/loginM", (req, res) => {
  usermm = req.body.username;
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM manager WHERE username = ?",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].Password, (error, response) => {
          if (response) {
            const id = result[0].id;
            const token = jwt.sign({ id }, "jwtSecret", {
              expiresIn: 300,
            });
            req.session.user = result;

            res.json({ auth: true, token: token, result: result });
          } else {
            res.json({ auth: false, message: "wrong username/password" });
          }
        });
      } else {
        res.json({ auth: false, message: "no user exits" });
      }
    }
  );
});

app.post("/loginR", (req, res) => {
  usermm = req.body.username;
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM customer WHERE username = ?",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].Password, (error, response) => {
          if (response) {
            const id = result[0].id;
            const token = jwt.sign({ id }, "jwtSecret", {
              expiresIn: 300,
            });
            req.session.user = result;

            res.json({ auth: true, token: token, result: result });
          } else {
            res.json({ auth: false, message: "wrong username/password" });
          }
        });
      } else {
        res.json({ auth: false, message: "no user exits" });
      }
    }
  );
});

app.post("/registerCheck", (req, res) => {
  const username = req.body.username;

  db.query(
    "SELECT * FROM customer WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        console.log(err);
      } else if (result.length > 0) {
        console.log(result.length);
        res.send("Already have this username");
      } else {
        res.send("pass");
      }
    }
  );
});

app.post("/registerCheckM", (req, res) => {
  const username = req.body.username;

  db.query(
    "SELECT * FROM manager WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        console.log(err);
      } else if (result.length > 0) {
        console.log(result.length);
        res.send("Already have this username");
      } else {
        console.log("pass");
        res.send("pass");
      }
    }
  );
});

app.post("/updateUE", (req, res) => {
  const Electric_unit = req.body.Electric_unit;
  const ID_meter = req.body.ID_meter;
  db.query(
    "UPDATE meter_unit SET Electric_unit = ? WHERE ID_meter = ?",
    [Electric_unit, ID_meter],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/updateUW", (req, res) => {
  const Water_unit = req.body.Water_unit;
  const ID_meter = req.body.ID_meter;
  db.query(
    "UPDATE meter_unit SET Water_unit = ? WHERE ID_meter = ?",
    [Water_unit, ID_meter],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/packagese", (req, res) => {
  const name = req.body.name;
  const room = req.body.room;
  const phone = req.body.phone;
  db.query(
    "INSERT INTO package (name,room,phone,time,status) VALUES(?,?,?,CURRENT_TIMESTAMP(),'รอรับ');",
    [name, room, phone],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/packagedata", (req, res) => {
  db.query(
    "SELECT * FROM package WHERE room = any(SELECT room_number FROM rent_room WHERE Customer_id = (SELECT ID_Customer FROM customer WHERE username = ?)) AND status = 'รอรับ'",
    [usermm],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/updateconfirmpack", (req, res) => {
  const status = req.body.status;
  const id = req.body.id;

  db.query(
    "UPDATE `package` SET `status` = ? WHERE `id` = ?",
    [status, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Contract Inserted");
      }
    }
  );
});

app.get("/persondata", (req, res) => {
  db.query(
    "SELECT * FROM customer WHERE username = ?",
    [usermm],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/personadata", (req, res) => {
  db.query(
    "SELECT * FROM manager WHERE username = ?",
    [usermm],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/sendproblem", (req, res) => {
  const problem = req.body.problem;
  const detail = req.body.detail;
  const phone = req.body.phone;
  const room = req.body.room;

  db.query(
    "INSERT INTO repair_ (Customer_id,phone,problem,detail,date,status,room) VALUES((SELECT ID_Customer FROM customer WHERE username = ?),?,?,?,CURRENT_TIMESTAMP(),'รอรับเรื่อง',?)",
    [usermm, phone, problem, detail, room],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Contract Inserted");
      }
    }
  );
});

app.get("/problemdata", (req, res) => {
  db.query(
    "SELECT * FROM repair_ WHERE Customer_id = (SELECT ID_Customer from customer WHERE username = ?)",
    [usermm],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/problemdatama", (req, res) => {
  db.query(
    "SELECT * FROM repair_ WHERE status = 'รอรับเรื่อง' OR status = 'กำลังดำเนินการ' ",
    [usermm],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/updatesave", (req, res) => {
  console.log(req.body.id);
  const status = req.body.status;
  const note = req.body.note;
  const id = req.body.id;

  db.query(
    "UPDATE `repair_` SET `status` = ? ,note = ? WHERE `ID` = ?",
    [status, note, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Contract Inserted");
      }
    }
  );
});

app.post("/updatefinish", (req, res) => {
  const status = req.body.status;
  const id = req.body.id;

  db.query(
    "UPDATE `repair_` SET `status` = ?  WHERE `ID` = ?",
    [status, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Contract Inserted");
      }
    }
  );
});

app.post("/editc", (req, res) => {
  const name = req.body.name;
  const lastname = req.body.lastname;
  const phone = req.body.phone;
  const email = req.body.email;
  db.query(
    "UPDATE customer SET Name = ? , Lastname = ?, Phone = ?,Email = ?   WHERE username = ?",
    [name, lastname, phone, email, usermm],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/editm", (req, res) => {
  const name = req.body.name;
  const lastname = req.body.lastname;
  const phone = req.body.phone;
  const email = req.body.email;
  db.query(
    "UPDATE manager SET Name = ? , Lastname = ?, Phone = ?,Email = ?   WHERE username = ?",
    [name, lastname, phone, email, usermm],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

server.listen(3002, () => {
  console.log("SERVER IS RUNNING");
});
app.listen("3001", () => {
  console.log("servers is runing on port 3001");
});
