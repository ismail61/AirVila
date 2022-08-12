function socketImplementation(eventEmitter, io) {
    let orders = [];
    let vendors = [];
    let customers = [];
    const addOrder = (orderId, socketId) => {
        !orders?.some((order) => order.orderId === orderId) &&
            orders?.push({ orderId, socketId });
    };
    const addVendor = (vendorId, socketId) => {
        !vendors?.some((vendor) => vendor.vendorId === vendorId) &&
            vendors?.push({ vendorId, socketId });
    };
    const addCustomer = (customerId, socketId) => {
        !customers?.some((customer) => customer.customerId === customerId) &&
            customers?.push({ customerId, socketId });
    };
    const removeOrder = (socketId) => {
        orders = orders?.filter((order) => order.socketId !== socketId);
    };
    const removeVendor = (socketId) => {
        vendors = vendors?.filter((vendor) => vendor.socketId !== socketId);
    };
    const removeCustomer = (socketId) => {
        customers = customers?.filter((customer) => customer.socketId !== socketId);
    };
    const getOrder = (orderId) => {
        return orders?.find((order) => order.orderId == orderId);
    };
    const getVendor = (vendorId) => {
        return vendors?.find((vendor) => vendor.vendorId == vendorId);
    };
    const getCustomer = (customerId) => {
        return customers?.find((customer) => customer.customerId == customerId);
    };

    io.on("connection", (socket) => {

        socket.on("addOrder", (orderId) => {
            if (orderId) {
                addOrder(orderId, socket.id);
                io.emit("getOrders", orders);
            }
        });

        socket.on("addVendor", (vendorId) => {
            if (vendorId) {
                addVendor(vendorId, socket.id);
                io.emit("getVendors", vendors);
            }
        });

        socket.on("addCustomer", (customerId) => {
            if (customerId) {
                addCustomer(customerId, socket.id);
                io.emit("getCustomers", customers);
            }
        });

        socket.on("disconnect", () => {
            removeOrder(socket.id);
            removeVendor(socket.id);
            removeCustomer(socket.id)
            io.emit("getOrders", orders);
        });
    });
    eventEmitter.on("orderUpdated", (data) => {
        let order = getOrder(data._id);
        io.to(order?.socketId).emit("orderUpdated", data);
    });
    eventEmitter.on("orderPaid", (data) => {
        let order = getOrder(data._id);
        io.to(order?.socketId).emit("orderPaid", data);
    });
    eventEmitter.on("orderPlaced", (data) => {
        let vendor = getVendor(data.vendorId);
        io.to(vendor?.socketId).emit("orderPlaced", data);
    });
    eventEmitter.on("orderRenewed", (data) => {
        let vendor = getVendor(data.vendorId);
        io.to(vendor?.socketId).emit("orderRenewed", data);
    });
    eventEmitter.on("orderDeleted", (data) => {
        let vendor = getVendor(data.vendorId);
        io.to(vendor?.socketId).emit("orderDeleted", data);
    });
    eventEmitter.on("orderReturned", (data) => {
        let order = getOrder(data._id);
        io.to(order?.socketId).emit("orderReturned", data);
    });
    eventEmitter.on("orderReturnedDateAssign", (data) => {
        let order = getOrder(data._id);
        io.to(order?.socketId).emit("orderReturnedDateAssign", data);
    });
    eventEmitter.on("admin-new-message", (data) => {
        io.emit("admin-new-message");
    });
    eventEmitter.on("customer-new-message", (data) => {
        let customer = getCustomer(data.customer_id);
        io.to(customer?.socketId).emit("customer-new-message", data);
    });
    eventEmitter.on("vendor-new-message", (data) => {
        let vendor = getVendor(data.vendor_id);
        io.to(vendor?.socketId).emit("vendor-new-message", data);
    });
    eventEmitter.on("bookDeleted", (data) => {
        io.emit("bookDeleted");
    });
    eventEmitter.on("bookUpdated", (data) => {
        io.emit("bookUpdated");
    });
}
export default socketImplementation;
