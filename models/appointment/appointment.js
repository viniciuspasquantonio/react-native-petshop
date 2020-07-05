class Appointment {
    constructor(id, startTime, endTime, customer, pet,price, services) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.customer = customer;
        this.pet = pet;
        this.price = price;
        this.services = services;
    }
}

export default Appointment;
