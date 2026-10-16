# Drink Stall Website
## About
This is a website designed to be used for internal workflow of a drink stall in a university festival. 
The website allow the cashier to take order and send it to the kitchen through any browser. It also record order history.
The website was created using HTML, CSS, and JavaScript, all of which was learned from scratch in the span of two weeks.
It is hosted using Firebase and all data are stored on Firestore in order to be accessible for any device. 
Throughout the two days of the festival, the website works perfectly fine with minimal error. 
The only issue was that unstable internet connection causes some order to be recorded multiple times.

## Personal Note
I had a lot of fun working on this project! It was a real challenge and I learned a lot in the two weeks I spent developing it. 
There were a lot of changes required throughout the development, all of which prove to be really challenging.
I hope to get a chance to further develop this for the festival next year!

## Feature
All page has a header section to access all other pages.
### Order
This page is made for the cashier who take order and charge customers. It includes the following features:
- Create new order.
- Has interface that uses color to distinguish between drinks.
- Has navigation bar for each menu categories.
- Contain "Verify Order" page to confirm the order with the customer, allowing any modification and addons.
- Display total price for the order.
- See OrderID which will be given to customers on a small piece of paper as a queue number.
- Send order to Firestore database.
<p align="center">
  <img width=auto height="400" alt="247512_0" src="https://github.com/user-attachments/assets/7db734be-2cce-4c0f-954d-6bca00cffb90">
  <br>
  <em>Order page</em>
</p>
<p align="center">
  <img width=auto height="400" alt="247513_0" src="https://github.com/user-attachments/assets/e5262072-8447-41d9-b686-2a6f1f31bdfc" />
  <br>
  <em>Verify page</em>
</p>


### Kitchen
This page is made for people who makes drink in the stall. It includes the following features:
- Display all ongoing orders, including OrderID and item lists.
- Automatically update when new orders come in, putting newer order at the bottom.
- Mark orders as completed.
- Cancel orders.
- Mark certain items as unavailable.
<p align="center">
  <img width=auto height="400" alt="247514_0" src="https://github.com/user-attachments/assets/965eb34e-443e-4e4c-805a-4e9af366428d" />
  <br>
  <em>Kitchen page</em>
</p>

### History
This page is made for anyone in the stall to look at past order history and feels happy about the sales. It includes the following features:
- Display all orders, including all completed, ongoing, and cancelled ones.
- The orders are sorted by newest one first.
- Automatically update when any change occurs to the order data.
- Show total money earned from the sales.
<p align="center">
  <img width=auto height="400" alt="247515_0" src="https://github.com/user-attachments/assets/1b64457e-bf73-451a-b9a4-37caaf5428cf" />
  <br>
  <em>Order page</em>
</p>
