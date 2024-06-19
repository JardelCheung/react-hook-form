import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
  useFieldArray,
} from 'react-hook-form';
import { flushSync } from 'react-dom';
import { useState } from 'react';

export interface FormModel {
  myArray: { name: string }[];
}
interface SideBarProps {
  selected?: number;
}
const SideBar = ({ selected }: SideBarProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormModel>();

  if (selected === undefined) {
    return <></>;
  }

  return (
    <>
      Element error:
      {errors?.myArray?.[selected]?.name?.message}
      <br />
      Selected: {selected}
      <Controller
        control={control}
        name={`myArray.${selected}.name`}
        rules={{ required: { value: true, message: 'required' } }}
        render={({ field }) => <input {...field} />}
        shouldUnregister={false}
      />
    </>
  );
};

const Form = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormModel>();
  const { append, fields } = useFieldArray({
    control,
    name: 'myArray',
    rules: {
      validate: (myArray: { name: string }[]) => {
        // hasDuplicates
        if (new Set(myArray.map(({ name }) => name)).size !== myArray.length) {
          return 'has duplicates';
        }
      },
    },
  });
  const [selected, setSelected] = useState<number | undefined>();
  const onSelectedChange = (value: number) => {
    flushSync(() => setSelected(undefined)); // else the values nextField.value will be overwritten with previousField.value (bug?)
    flushSync(() => setSelected(value));
    //setSelected(value);
  };
  const myArray = useWatch({ control, name: 'myArray' });
  const arrayErrors: (string | undefined)[] = fields.map(
    (_, index) => errors?.myArray?.[index]?.name?.message,
  );
  return (
    <>
      Array errors: {errors?.myArray?.root?.message}
      <br />
      Array element errors: {JSON.stringify(arrayErrors)}
      <br />
      Array contents: {JSON.stringify(myArray)}
      <br />
      <button onClick={() => append({ name: 'a' })}>Add array element</button>
      <br />
      <br />
      Select array element:
      <select onChange={(e) => onSelectedChange(+e.target.value)}>
        {fields.map((field, index) => (
          <option key={field.id} value={index}>
            {index}
          </option>
        ))}
      </select>
      <br />
      Sidebar:
      <br />
      <SideBar selected={selected} />
    </>
  );
};

const Issue = () => {
  const methods = useForm({ defaultValues: { myArray: [] }, mode: 'all' });
  return (
    <FormProvider {...methods}>
      <Form />
    </FormProvider>
  );
};
export default Issue;
