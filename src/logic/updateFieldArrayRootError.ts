import {
  FieldError,
  FieldErrors,
  FieldValues,
  InternalFieldName,
} from '../types';
// import compact from '../utils/compact';
import convertToArrayPayload from '../utils/convertToArrayPayload';
import get from '../utils/get';
import set from '../utils/set';

export default <T extends FieldValues = FieldValues>(
  errors: FieldErrors<T>,
  error: Partial<Record<string, FieldError>>,
  name: InternalFieldName,
): FieldErrors<T> => {
  console.log(
    'updateFieldArrayRootError.ts before Change errors  ---> ',
    errors,
  );
  const fieldArrayErrors = convertToArrayPayload(get(errors, name));
  console.log(
    'updateFieldArrayRootError.ts after Changed errors ---> ',
    fieldArrayErrors,
  );
  set(fieldArrayErrors, 'root', error[name]);
  set(errors, name, fieldArrayErrors);
  return errors;
};
