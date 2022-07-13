const deliveryPricing = [
    {
        message: "Less Than Equal to 2KM",
        value: "15",
        distance: "2"
    },
    {
        message: "Less Than Equal to 4KM",
        value: "20",
        distance: "4"
    },
    {
        message: "After 3KM",
        value: "4/Km",
        distance: "3"
    },
    {
        message: "For Out Of Location(Above 4KM) \n (Return Distance=total distance - 4)",
        value: "2/Km return",
        distance: "4"
    },
]

module.exports = deliveryPricing