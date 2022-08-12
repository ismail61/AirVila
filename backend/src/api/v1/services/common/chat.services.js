import { ChatModel } from "../../database/common";

export const checkChatExist = async (query) => {
  try {
    return await ChatModel.findOne(query).lean();
  } catch (err) {
    console.log(err);
  }
}

export const createChat = async (data) => {
  try {
    const newChat = await new ChatModel(data).save();
    return await newChat.populate([
      {
        path: 'guestId',
        model: 'User',
        select: 'firstName lastName image createdAt'
      },
      {
        path: 'hostId',
        model: 'User',
        select: 'firstName lastName image createdAt'
      }
    ]);
  } catch (err) {
    console.log(err);
  }
}

export const addMessageInChat = async (query, message) => {
  try {
    return await ChatModel.findOneAndUpdate(query, { $push: { messages: message } }, { new: true }).populate([
      {
        path: 'guestId',
        model: 'User',
        select: 'firstName lastName image createdAt'
      },
      {
        path: 'hostId',
        model: 'User',
        select: 'firstName lastName image createdAt'
      }
    ]).lean().exec()
  } catch (err) {
    console.log(err);
  }
}

export const getAllChats = async (query) => {
  try {
    return await ChatModel.find(query).sort({ updatedAt: -1 }).populate([
      {
        path: 'guestId',
        model: 'User',
        select: 'firstName lastName image createdAt'
      },
      {
        path: 'hostId',
        model: 'User',
        select: 'firstName lastName image createdAt'
      }
    ]).lean();
  } catch (err) {
    console.log(err);
  }
}

export const getSingleChat = async (query) => {
  try {
    return await ChatModel.findOne(query).sort({ updatedAt: -1 }).populate([
      {
        path: 'guestId',
        model: 'User',
        select: 'firstName lastName image createdAt'
      },
      {
        path: 'hostId',
        model: 'User',
        select: 'firstName lastName image createdAt'
      }
    ]).lean();
  } catch (err) {
    console.log(err);
  }
}


//customer

export const getCustomerMessage = async (query) => {
  try {
    return await ChatModel.find(query).sort({ updatedAt: -1 }).populate({
      path: 'vendor_id',
      model: 'Vendor',
      select: 'seller_account.shop_name logo.url'
    }).lean();
  } catch (err) {
    console.log(err);
  }
}

//admin

export const getAdminMessage = async (query) => {
  try {
    return await ChatModel.find(query).sort({ updatedAt: -1 }).populate({
      path: 'vendor_id',
      model: 'Vendor',
      select: 'seller_account.shop_name logo.url'
    }).lean();
  } catch (err) {
    console.log(err);
  }
}

export const getSpecificVendorMessage = async (query) => {
  try {
    return await ChatModel.find(query).sort({ updatedAt: -1 }).populate({
      path: 'vendor_id',
      model: 'Vendor',
      select: 'seller_account.shop_name logo.url'
    }).lean();
  } catch (err) {
    console.log(err);
  }
}
