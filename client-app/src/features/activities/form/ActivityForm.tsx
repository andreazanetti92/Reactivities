import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {v4 as uuid} from 'uuid';
import { useHistory, useParams } from "react-router";
import { Button, Header, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import { useStore } from "../../../app/stores/store";
import { Link } from "react-router-dom";
import { Form, Formik } from "formik";
import * as yup from 'yup';
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import { CategoryOptions } from "../../../app/common/options/CategoryOptions";
import DateTimeInput from "../../../app/common/form/DateTimeInput";
import { Activity } from "../../../app/models/Activity";

export default observer(function ActivityForm() {

  const history = useHistory();
  const {activityStore} = useStore();
  const {loading,createActivity, updateActivity , loadActivity, loadingInitial} = activityStore
  const {id} = useParams<{id: string}>();

  const [activity, setActivity] = useState<Activity>({
    id: '',
    title: '',
    description: '',
    category: '',
    date: null,
    city: '',
    venue: ''
  });

  const validationSchema = yup.object({
    title: yup.string().required('Title is required'),
    description: yup.string().required('description is required'),
    category: yup.string().required('category is required'),
    date: yup.date().required('date is required').nullable(),
    city: yup.string().required('city is required'),
    venue: yup.string().required('venue is required'),
  })

  useEffect(() => {
    if(id) loadActivity(id).then(activity => setActivity(activity!))
  }, [id, loadActivity])
  
  function handleSubmit(activity: Activity) {
    if(activity.id.length === 0){
      let newActivity = {
        ...activity,
        id: uuid()
      }
      createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`))
    }else{
      updateActivity(activity).then(() => history.push(`/activities/${activity.id}`))
    }
  }

  if(loadingInitial) return <LoadingComponent content='Loading activity...' />

  return (
    <Segment clearing>
      <Header content='Activity Details' sub color='teal' />
      <Formik 
        validationSchema={validationSchema}
        enableReinitialize 
        initialValues={activity} 
        onSubmit={values => handleSubmit(values)} >
        {({handleSubmit, isValid, isSubmitting, dirty}) => (
          <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
            <TextInput placeholder='Title' name='title' />
            <TextArea rows={4} placeholder='Description'name='description' />
            <SelectInput options={CategoryOptions} placeholder='Category' name='category' />
            <DateTimeInput
              placeholderText='Date' 
              name='date'
              showTimeSelect
              timeCaption='time'
              dateFormat='MMMM d E, yyyy h:mm aa'
            />
            <Header content='Location Details' sub color='teal' />
            <TextInput placeholder='City' name='city' />
            <TextInput placeholder='Venue' name='venue' />
            <Button 
              disabled={isSubmitting || !dirty || !isValid}
              loading={loading} 
              floated='right' 
              positive 
              type='submit' 
              content='Submit'
            />
            <Button as={Link} to='/activities' floated='right' type='button' content='Close'/>
          </Form>
        )}
      </Formik>
    </Segment>
  )
})