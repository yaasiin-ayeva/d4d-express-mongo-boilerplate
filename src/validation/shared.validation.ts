import * as Joi from 'joi';
import { objectId } from './custom.validation';

const _joiObjByMongoId = {
    body: Joi.object().keys({
        _id: Joi.string().required().custom(objectId),
    }),
};

export {
    _joiObjByMongoId,
}