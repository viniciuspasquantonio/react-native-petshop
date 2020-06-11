class Appointment {
    constructor(id, startTime, endTime, customerId, price, appointmentServices) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.customerId = customerId;
        this.price = price;
        this.appointmentServices = appointmentServices;
    }
}

export default Appointment;
