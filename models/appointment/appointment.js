class Appointment {
    constructor(id, startTime, endTime, customer, pet,price, services,status) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.customer = customer;
        this.pet = pet;
        this.price = price;
        this.services = services;
        this.status = status;
    }
}

export default Appointment;
