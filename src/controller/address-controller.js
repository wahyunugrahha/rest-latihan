import addressService from "../service/address-service";

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    const contact_id = req.params.contact_id;

    const result = await addressService.create(user, contact_id, request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  create,
};
