class AppointmentService {
    constructor(id, appointmentId, serviceId, serviceAddons, apointmentServices, price, petId) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.serviceId = serviceId;
        this.serviceAddons = serviceAddons;
        this.apointmentServices = apointmentServices;
        this.price = price;
        this.petId = petId;
    }
}

export default AppointmentService;
