class Appointment {
    constructor(id, startTime, endTime, customer, price, appointmentServices) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.customer = customer;
        this.price = price;
        this.appointmentServices = appointmentServices;
    }
}

export default Appointment;
