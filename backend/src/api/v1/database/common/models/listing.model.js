import mongoose from "mongoose";
import { StringRequired } from '../../type/stringRequired';
import { NumberRequired } from '../../type/numberRequired';
import { BooleanDefaultFalse } from '../../type/BooleanDefaultFalse';

const listingSchema = new mongoose.Schema({
    id: {
        ...StringRequired,
        unique: true,
        index: true
    },
    userId: {
        ...StringRequired,
        index: true
    },
    title: {
        ...StringRequired,
        unique: true,
        index: true,
        max: 60
    },
    description: {
        ...StringRequired,
        max: 500
    },
    descriptionOfArea: {
        ...StringRequired,
        max: 250
    },
    place: {
        type: StringRequired, // Apartment, House, Hotel Room, Hotel Room, Resort etc
        describe: String, // home, Condo, Cabin, etc
        space: StringRequired, // Entire Place, Private Room, Shared Room
    },
    specialty: [StringRequired],
    size: NumberRequired,
    photos: [{
        url: StringRequired
    }],
    status: {
        ...StringRequired,
        enum: ['On Process', 'Listed', 'Unlisted'],
        default: 'On Process'
    },
    lengthOfStay: {
        minimum: Number,
        maximum: Number
    },
    checkInTime: {
        checkInTimeType: String,
        time: String
    },
    checkOutTime: {
        checkOutTimeType: String,
        time: String    // 8 AM
    },
    coHost: {
        name: String,
        phone: String
    },
    availability: {
        futureBookingMonths: Number,
        advanceNoticeBookingDays: Number
    },
    guestRating: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
            index: true
        }
    ],
    rating: {
        cleanliness: Number,
        behavior: Number,
        accuracyOrCommitment: Number,
        Location: Number,
        Value: Number,
        flexibleCheckIn: Number,
        avg: Number,
    },
    price: {
        base: NumberRequired,
        additionalGuestRent: Number,
        cleaningFee: Number,
        carParkingFee: Number,
    },
    calenders: [
        {
            date: Date,
            available: Boolean,
            availabilityNote: String,
            priceNote: String,
            price: Number,
        }
    ],
    pets: {
        allowed: Boolean,
        additionalPetsRent: Number
    },
    discount: {
        threeDays: Number, // percentage
        weekly: Number, // percentage
        monthly: Number // percentage
    },
    coupons: [{
        code: String,
        discountType: {
            type: String,
            enum: ['FLAT', 'PERCENTAGE']
        },
        discount: Number
    }],
    address: {
        houseNo: StringRequired,
        floor: StringRequired,
        roadNo: StringRequired,
        block: String,
        area: StringRequired,
        thana: StringRequired,
        city: StringRequired,
        state: StringRequired,
        zipCode: String,
        country: StringRequired
    },
    guestsCapacity: {
        ...NumberRequired,
        min: 1,
        max: 30
    },
    bedsCapacity: {
        ...NumberRequired,
        min: 1,
        max: 50
    },
    bedRoomsCapacity: {
        ...NumberRequired,
        min: 1,
        max: 50
    },
    bathRoomsCapacity: {
        ...NumberRequired,
        min: 1,
        max: 50
    },
    kitchensCapacity: {
        type: Number,
        max: 20
    },
    carQuantityCapacity: {
        type: Number,
        max: 30
    },
    popularAmenities: {
        airConditioning: BooleanDefaultFalse,
        cleaningItems: BooleanDefaultFalse,
        wifi: BooleanDefaultFalse,
        tv: BooleanDefaultFalse,
        movieAccess: BooleanDefaultFalse,
        essentials: BooleanDefaultFalse,
        carRental: BooleanDefaultFalse,
        dedicatedWorkstation: BooleanDefaultFalse,
        dishesAndSilverware: BooleanDefaultFalse,
        barbecueUtensils: BooleanDefaultFalse,
        hairDryer: BooleanDefaultFalse,
        iron: BooleanDefaultFalse,
        shampoo: BooleanDefaultFalse,
        handWashingSoap: BooleanDefaultFalse,
        kitchen: BooleanDefaultFalse,
        swimmingPool: BooleanDefaultFalse,
        babySafetyGates: BooleanDefaultFalse,
        oven: BooleanDefaultFalse,
        geezer: BooleanDefaultFalse,
        exerciseEquipments: BooleanDefaultFalse,
        fireExtinguisher: BooleanDefaultFalse
    },
    bathroomAmenities: {
        bathtub: BooleanDefaultFalse,
        babyShop: BooleanDefaultFalse,
        showerGel: BooleanDefaultFalse,
        handWashingSoap: BooleanDefaultFalse,
        cleaningProducts: BooleanDefaultFalse,
        shampoo: BooleanDefaultFalse,
        conditioner: BooleanDefaultFalse,
        hairDryer: BooleanDefaultFalse,
        highCommode: BooleanDefaultFalse,
        geezer: BooleanDefaultFalse,
    },
    bedroomAmenities: {
        airConditioning: BooleanDefaultFalse,
        essentials: BooleanDefaultFalse,
        beadLines: BooleanDefaultFalse,
        clothingStorage: BooleanDefaultFalse,
        tissues: BooleanDefaultFalse,
        hairDryer: BooleanDefaultFalse,
        extraMattress: BooleanDefaultFalse,
        extraBedSheets: BooleanDefaultFalse,
        extraTowels: BooleanDefaultFalse,
        extraPillows: BooleanDefaultFalse,
        extraBlankets: BooleanDefaultFalse,
        iron: BooleanDefaultFalse,
        hangers: BooleanDefaultFalse,
        mosquitoNet: BooleanDefaultFalse,
        aerosol: BooleanDefaultFalse,
    },
    familyAmenities: {
        babyBath: BooleanDefaultFalse,
        babySafetyGates: BooleanDefaultFalse,
        babyGameZone: BooleanDefaultFalse,
        changingTable: BooleanDefaultFalse,
        highChair: BooleanDefaultFalse,
        tableCornerGuard: BooleanDefaultFalse,
        windowGuards: BooleanDefaultFalse,
        washingMachine: BooleanDefaultFalse,
        roomHeater: BooleanDefaultFalse,
    },
    heatingAndCoolingAmenities: {
        airConditioning: BooleanDefaultFalse,
        cellingFans: BooleanDefaultFalse,
        indoorFirePlace: BooleanDefaultFalse,
        portableFans: BooleanDefaultFalse,
    },
    homeSafetyAmenities: {
        ccCamera: BooleanDefaultFalse,
        carbonMonoxideAlarm: BooleanDefaultFalse,
        fireExtinguisher: BooleanDefaultFalse,
        firstAidKit: BooleanDefaultFalse,
        smokeAlarm: BooleanDefaultFalse,
    },
    kitchenAndDiningAmenities: {
        kitchen: BooleanDefaultFalse,
        bakingSheet: BooleanDefaultFalse,
        barbecueUtensils: BooleanDefaultFalse,
        breadMaker: BooleanDefaultFalse,
        blender: BooleanDefaultFalse,
        coffeeMaker: BooleanDefaultFalse,
        cookingBasics: BooleanDefaultFalse,
        dinningTable: BooleanDefaultFalse,
        dishWasher: BooleanDefaultFalse,
        freezer: BooleanDefaultFalse,
        hotWaterKettle: BooleanDefaultFalse,
        microWave: BooleanDefaultFalse,
        miniFridge: BooleanDefaultFalse,
        oven: BooleanDefaultFalse,
        refrigerator: BooleanDefaultFalse,
        riceCooker: BooleanDefaultFalse,
        stove: BooleanDefaultFalse,
        toaster: BooleanDefaultFalse,
        trashCompactor: BooleanDefaultFalse,
        enoughPlatesGlassesSpoons: BooleanDefaultFalse,
    },
    locationFeaturesAmenities: {
        beachAccess: BooleanDefaultFalse,
        lakeAccess: BooleanDefaultFalse,
        resortAccess: BooleanDefaultFalse,
        privateEntrance: BooleanDefaultFalse,
        waterFront: BooleanDefaultFalse,
    },
    outdoorAmenities: {
        backyard: BooleanDefaultFalse,
        bbqGrill: BooleanDefaultFalse,
        beachEssentials: BooleanDefaultFalse,
        bikes: BooleanDefaultFalse,
        boatsSlip: BooleanDefaultFalse,
        kayak: BooleanDefaultFalse,
        outdoorDiningArea: BooleanDefaultFalse,
        outdoorFurniture: BooleanDefaultFalse,
        outdoorKitchen: BooleanDefaultFalse,
        balcony: BooleanDefaultFalse,
    },
    parkingAndFacilitiesAmenities: {
        elevator: BooleanDefaultFalse,
        evCharger: BooleanDefaultFalse,
        generatorFacilities: BooleanDefaultFalse,
        freeParkingOnPremises: BooleanDefaultFalse,
        freeStreetParking: BooleanDefaultFalse,
        paidParkingOnPremises: BooleanDefaultFalse,
        paidParkingOffPremises: BooleanDefaultFalse,
        gym: BooleanDefaultFalse,
        pool: BooleanDefaultFalse,
        singleLevelHome: BooleanDefaultFalse,
    },
    servicesAmenities: {
        breakfast: BooleanDefaultFalse,
        cleaningAfterCheckOut: BooleanDefaultFalse,
        cleaningBeforeCheckIn: BooleanDefaultFalse,
        longTermStayAllowed: BooleanDefaultFalse,
        carRental: BooleanDefaultFalse,
        laundry: BooleanDefaultFalse,
        foodDelivery: BooleanDefaultFalse,
        luggageDropOffAllowed: BooleanDefaultFalse,
    },
}, { timestamps: true });

export default mongoose.model("Listing", listingSchema);