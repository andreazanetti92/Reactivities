import { useField } from "formik";
import React from "react";
import { Form, Label } from "semantic-ui-react";
import DatePicker, {ReactDatePickerProps} from 'react-datepicker'

export default function DateTimeInput(props: Partial<ReactDatePickerProps>){
  const [field, meta, helpers] = useField(props.name!);

  const today = new Date();
  const currentDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

  return (
    <Form.Field error={meta.touched && !!meta.error} >
      <DatePicker 
        {...field}
        {...props}
        selected={(field.value && new Date(field.value)) || null}
        onChange={value => helpers.setValue(value)}
        minDate={new Date(currentDate)}
      />
      {meta.touched && meta.error ? (
        <Label basic color='red' >{meta.error}</Label>
      ) : null}
    </Form.Field>
  )
}