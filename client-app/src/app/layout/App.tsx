import React, { Fragment, useEffect, useState } from 'react';
import {v4 as uuid} from 'uuid';

import { Container } from 'semantic-ui-react';
import { Activity } from '../models/Activity';
import Navbar from './Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponents';

function App() {

    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        agent.Activities.list().then((res) => {
            let activities: Activity[] = []
            res.forEach(activity => {
                activity.date = activity.date.split('T')[0];
                activities.push(activity);
            })
            setActivities(activities);
            setLoading(false);
        })
    }, [])

    function handleSelectActivity(id:string) {
        setSelectedActivity(activities.find(x => x.id === id))
    }

    function handleCancelSelectActivity() {
        setSelectedActivity(undefined);
    }

    function handleFormOpen(id?: string){
        id ? handleSelectActivity(id) : handleCancelSelectActivity();
        setEditMode(true);
    }

    function handleFormClose(){
        setEditMode(false);
    }

    function handleCreateOrEditActivity(activity: Activity){
        setSubmitting(true);
        if(activity.id){
            agent.Activities.update(activity).then(() => {
                setActivities([...activities.filter(x => x.id !== activity.id), activity])
                setSelectedActivity(activity);
                setEditMode(false);
                setSubmitting(false);
            })
        }else {
            activity.id = uuid();
            setActivities([...activities, activity]);
            setEditMode(false);
            setSubmitting(false);
        }
    }

    function handleDeleteActivity(id: string){
        setSubmitting(true);
        agent.Activities.delete(id).then(() => {
            setActivities([...activities.filter(x => x.id !== id)])
            setSubmitting(false);
        })
    }

    if(loading) return <LoadingComponent content='Loading Events' /> 

    return (
        <>
            <Navbar openForm={handleFormOpen} />

            <Container style={{marginTop: '7em'}}>
               <ActivityDashboard 
                activities={activities}
                selectActivity={handleSelectActivity}
                selectedActivity={selectedActivity} 
                cancelSelectActivity={handleCancelSelectActivity}
                editMode={editMode}
                openForm={handleFormOpen}
                closeForm={handleFormClose}
                createOrEdit={handleCreateOrEditActivity}
                deleteActivity={handleDeleteActivity}
                submitting={submitting}
                />
            </Container>
        </>
    );
}

export default App;
