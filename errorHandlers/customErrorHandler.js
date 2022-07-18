class CustomErrorHandler extends Error {
    constructor(status,desc,data){
        super(desc)
        this.status = status
        this.success = false
        this.desc = desc
        this.data = data
    }

    static getCustomError(status,desc,data){
        return new CustomErrorHandler(status,desc,data);
    }

}

module.exports = CustomErrorHandler