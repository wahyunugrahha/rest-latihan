import addressService from "../service/address-service";

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    const contactId = req.params.contact_id;

    const result = await addressService.create(user, contactId, request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const user = req.user;
    const contactId = req.params.contact_id;
    const addressId = req.params.addressId;

    const result = await addressService.get(user, contactId, addressId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};
export default {
  create,
  get,
};
