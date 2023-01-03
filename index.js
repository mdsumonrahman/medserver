const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const corse = require('cors');
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
//middleware
app.use(corse());
app.use(express.json());
const Port = process.env.Port || 5000;
// Check Server port on server console
app.listen(Port, () => {
    console.log('server is running on', Port)
})
// check server is running on cliend side
app.get('/', (req, res) => {
    res.send('Server is running')
})
// Category api 
// add category
const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@users.95k0mgf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
function run() {
    try {
        // database
        const dataBase = client.db('Medlife');
        // category collection
        const categoryCollection = dataBase.collection('productCategory');
        // add category
        app.post('/product-category', async (req, res) => {
            const categoryData = req.body;
            const result = await categoryCollection.insertOne(categoryData);
            res.send(result);
        })
        // load category
        app.get('/product-category', async (req, res) => {
            const filter = {};
            const result = await categoryCollection.find(filter).toArray();
            res.send(result)
        })
        // delete Category
        app.delete('/product-category/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await categoryCollection.deleteOne(filter);
            res.send(result)
        })
        // update category
        app.patch('/product-category/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const updateData = {
                $set: {
                    title: data.title,
                    image: data.image,
                    note: data.note,
                }
            }
            const filter = { _id: ObjectId(id) };
            const result = await categoryCollection.updateOne(filter, updateData);
            res.send(result)
        })

        // Product Api
        //create product collection
        const productCollection = dataBase.collection('productCollection');
        // add category
        app.post('/products', async (req, res) => {
            const productData = req.body;
            const result = await productCollection.insertOne(productData);
            res.send(result);
        })
        // load products
        app.get('/products', async (req, res) => {
            const filter = {};
            const result = await productCollection.find(filter).toArray();
            res.send(result)
        })
        // delete product
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(filter);
            res.send(result)
        })
        //load single product
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await productCollection.findOne(filter);
            res.send(result)
        })
        // load category product
        app.get('/products/category/:catName', async (req, res) => {
            const category = req.params.catName;
            const filter = { category: category };
            const result = await productCollection.find(filter).toArray();
            res.send(result)
        })
        // update Product
        app.patch('/products/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const updateData = {
                $set: {
                    title: data.title,
                    price: data.price,
                    offerPrice: data.offerPrice,
                    description: data.description,
                }
            }
            console.log(updateData)
            const filter = { _id: ObjectId(id) };
            const result = await productCollection.updateOne(filter, updateData);
            res.send(result)
        })
        // cart collection
        const cartCollection = dataBase.collection('cart');
        // add to cart
        app.post('/cart', async (req, res) => {
            const cartData = req.body;
            const result = await cartCollection.insertOne(cartData);
            res.send(result)
        })
        app.get('/cart', async (req, res) => {
            let filter = {};
            if (req.query.email) {
                filter = {
                    email: req.query.email
                }
            }
            const result = await cartCollection.find(filter).toArray();
            res.send(result)
        })
        app.delete('/cart', async (req, res) => {
            let filter = {};
            if (req.query.email) {
                filter = {
                    email: req.query.email
                }
            }
            const result = await cartCollection.deleteMany(filter);
            res.send(result)
        })
        const paidCartCollection = dataBase.collection('paidCollection');
        app.post('/paid-cart', async (req, res) => {
            const paidCartData = req.body;
            const result = await paidCartCollection.insertOne(paidCartData);
            res.send(result);
        })
        app.get('/paid-cart', async (req, res) => {
            let filter = {};
            if (req.query.email) {
                filter = {
                    email: req.query.email
                }
            }
            const result = await paidCartCollection.find(filter).toArray();
            res.send(result);
        })
        app.patch('/paid-cart/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const statusData = req.body.status;
            console.log(statusData)
            const updateData = {
                $set: {
                    status: statusData
                }
            }
            const result = await paidCartCollection.updateOne(filter, updateData);
            res.send(result)
        })
        // nurse collection
        const nurseCollection = dataBase.collection('nurseCollection');
        // add nurse
        app.post('/nurse', async (req, res) => {
            const nurseData = req.body;
            const result = await nurseCollection.insertOne(nurseData);
            res.send(result)
        })
        app.get('/nurse', async (req, res) => {
            const date = req.query.date;
            const filter = {};
            const result = await nurseCollection.find(filter).toArray();
            //already booked
            const bookingQuery = { bookingFor: date };
            const alreadyBooked = await nurseBookingCollection.find(bookingQuery).toArray();
            result.forEach(r => {
                const bookedNurse = alreadyBooked.filter(book => book.name !== r.name);
                console.log(bookedNurse)
            })
            res.send(result)
        })
        //Nurse booking collection
        const nurseBookingCollection = dataBase.collection('nurseBookingCollection');
        // add booking
        app.post('/nurse-booking', async (req, res) => {
            const nurseBookingData = req.body;
            const result = await nurseBookingCollection.insertOne(nurseBookingData);
            res.send(result)
        })
        //user collection        
        const userCollection = dataBase.collection('userCollection');
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result)
        })
        app.get('/users', async (req, res) => {
            const filter = {}
            const result = await userCollection.find(filter).toArray();
            res.send(result)
        })
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const admin = req.body.admin;
            const options = { upsert: true };
            const update = {
                $set: {
                    admin: admin
                }
            };
            const result = await userCollection.updateOne(filter, update, options);
            res.send(result)
        })
        //find user role
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const users = await userCollection.findOne(query);
            res.send(users)
        })


        //-----------------------------------------------------------------------------------------
        // appointmentonst 
        const appointmentOptionCollection = dataBase.collection('appointmentOptions');
        const bookingsCollection = dataBase.collection('bookings');
        // Use Aggregate to query multiple collection and then merge data
        app.post('/appointmentOptions', async (req, res) => {
            const appointment = req.body;
            const result = appointmentOptionCollection.insertOne(appointment)
            res.send(result)
        })
        app.get('/appointmentOptions', async (req, res) => {
            const date = req.query.date;
            const query = {};
            const options = await appointmentOptionCollection.find(query).toArray();

            // get the bookings of the provided date
            const bookingQuery = { appointmentDate: date }
            const alreadyBooked = await bookingsCollection.find(bookingQuery).toArray();
            console.log(alreadyBooked)

            // code carefully :D
            options.forEach(option => {
                const optionBooked = alreadyBooked.filter(book => book.treatment === option.name);
                const bookedSlots = optionBooked.map(book => book.slot);
                const remainingSlots = option.slots.filter(slot => !bookedSlots.includes(slot))
                console.log(date, option.name, bookedSlots)
                option.slots = remainingSlots;
            })
            res.send(options);
        });

        app.get('/appointmentSpecialty', async (req, res) => {
            const query = {}
            const result = await appointmentOptionCollection.find(query).project({ name: 1 }).toArray();
            res.send(result);
        })
        app.get('/bookings', async (req, res) => {
            let query = {};
            const email = req.query.email;
            if (email) {
                query = { email: email };
            }
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings);
        });

        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const booking = await bookingsCollection.findOne(query);
            res.send(booking);
        })

        app.patch('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updateInfo = {
                $set: {
                    payment: req.body.payment
                }
            };
            const booking = await bookingsCollection.updateOne(query, updateInfo);
            res.send(booking);
        })
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const query = {
                appointmentDate: booking.appointmentDate,
                email: booking.email,
                treatment: booking.treatment
            }

            const alreadyBooked = await bookingsCollection.find(query).toArray();

            if (alreadyBooked.length) {
                const message = `You already have a booking on ${booking.appointmentDate}`
                return res.send({ acknowledged: false, message })
            }

            const result = await bookingsCollection.insertOne(booking);
            // send email about appointment confirmation 
            // sendBookingEmail(booking)
            res.send(result);
        });
        //payment
        app.post('/create-payment-intent', async (req, res) => {
            const booking = req.body;
            const price = booking.price;
            const amount = price * 100;
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: "bdt",
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            res.send({
                clientSecret: paymentIntent.client_secret,
            });
        });

        //payment collection

    }
    finally {

    }
}

run()
