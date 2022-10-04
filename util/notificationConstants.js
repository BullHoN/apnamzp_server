// {"Order Placed","Order Confirmed","Order In Preperation",
// "Rider Assign","Rider Reached Shop","Rider On The Way","Order Delivered"
// ,"Order Cancelled"}

const notificationConstants = {

    "order_cancelled_by_admin": {
        "title": "Order Cancelled",
        "desc": "No Delivery Sathi Found"
    },

    "cancel_items_on_the_way": {
        "title": "Cancelled Items On The Way",
        "desc": "Item On The Was Not Accepted By Delivery Sathi"
    },

    "update_items_on_the_way_price": {
        "title": "Items On The Price Updated By Delivery Sathi",
        "desc": "Your Requested Items On The Way Is Added In Your Bill"
    },

    "delivery_sathi_assigned": {
        "title": "Delivery Sathi Assigned",
        "desc": "Your Delivery Sathi is assigned"
    },

    "order_accepted": {
        "title": "Order Accepted",
        "desc": "Your Order is accepted by shop and now preaparing"
    },

    "order_in_preperation": {
        "title": "Order In Preperation",
        "desc": "Your Order is being ready by resturant"
    },

    "out_for_delivery": {
        "title": "Out For Delivery",
        "desc": "Your Order Was Handed Over To The Delivery Sathi"
    },

    "rider_on_the_way": {
        "title": "Sathi On The Way",
        "desc": "Your Delivery Sathi taken the order from shop"
    },

    "order_delivered": {
        "title": "Order Delivered",
        "desc": "Thanks for choosing ApnaMzp, Please Share Your Feedback"
    },

    "review_received_shop": {
        "title": "Your shop received a new review",
        "desc": "A new review is made by a customer",
    }

}

module.exports = notificationConstants