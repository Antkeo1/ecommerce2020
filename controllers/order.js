const { Order, CartItem } = require("../models/order");
const User = require("../models/user");

const { errorHandler } = require("../helpers/dbErrorHandlers");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(
  "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"
);

exports.orderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      req.order = order;
      next();
    });
};

// your create order method with email capabilities
exports.create = (req, res) => {
  console.log("CREATE ORDER: ", req.body);
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error),
      });
    }
    // User.find({ categories: { $in: categories } }).exec((err, users) => {}
    console.log("ORDER IS JUST SAVED >>> ", order);
    // send email alert to admin
    const adminEmail = "sleav143@gmail.com";
    console.log(adminEmail);

    //const emailData = {
    //  to: adminEmail, // admin
    //  from: order.user.email,
    //  subject: `A new order is received`,
    //  html: `
    //        <h1>Hey Admin, Somebody just made a purchase in your ecommerce store</h1>
    //        <h2>Customer name: ${order.user.name}</h2>
    //        <h2>Customer address: ${order.address}</h2>
    //        <h2>User's purchase history: ${
    //          order.user.history.length
    //        } purchase</h2>
    //        <h2>User's email: ${order.user.email}</h2>
    //        <h2>Total products: ${order.products.length}</h2>
    //        <h2>Transaction ID: ${order.transaction_id}</h2>
    //        <h2>Order status: ${order.status}</h2>
    //        <h2>Product details:</h2>
    //        <hr />
    //        ${order.products
    //          .map((p) => {
    //            return `<div>
    //                    <h3>Product Name: ${p.name}</h3>
    //                    <h3>Product Price: ${p.price}</h3>
    //                    <h3>Product Quantity: ${p.count}</h3>
    //            </div>`;
    //          })
    //          .join("--------------------")}
    //        <h2>Total order cost: ${order.amount}<h2>
    //        <p>Login to your dashboard</a> to see the order in detail.</p>
    //    `,
    //};
    //sgMail
    //  .send(emailData)
    //  .then((sent) => console.log("SENT >>>", sent))
    //  .catch((err) => console.log("ERR >>>", err));

    // email to buyer
    const emailData2 = {
      to: "antoniokeo@codeworldinc.org",
      from: "antoniokeo@codeworldinc.org",
      subject: `You order is in process`,
      html: `
            <h1>Hey ${req.profile.name}/${
        order.user.email
      } Just made a purchase</h1>
            <h2>Contact info: ${order.contact}</h2>
             <h2>Shipping info: ${order.address}</h2>
            <h2>Total products: ${order.products.length}</h2>
            <h2>Transaction ID: ${order.transaction_id}</h2>
            <h2>Order status: ${order.status}</h2>
            <h2>Product details:</h2>
            <hr />
            ${order.products
              .map((p) => {
                return `<div>
                        <h3>Product Name: ${p.name}</h3>
                        <h3>Product Price: ${p.price}</h3>
                        <h3>Product Quantity: ${p.count}</h3>
                </div>`;
              })
              .join("--------------------")}
            <h2>Total order cost: ${order.amount}<h2>
            
        `,
    };
    sgMail
      .send(emailData2)
      .then((sent) => console.log("SENT 2 >>>", sent))
      .catch((err) => console.log("ERR 2 >>>", err));

    res.json(data);
  });
};

exports.listOrder = (req, res) => {
  Order.find()
    .populate("user", "_id name address contact")
    .sort("-created")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(orders);
    });
};

exports.getStatusValues = (req, res) => {
  //go to order schema, get the enum values from the status property
  res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(order);
    }
  );
};
