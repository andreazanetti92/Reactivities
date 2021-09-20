import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';

type Activity = {
    id: string,
    title: string,
    date: Date,
    description: string,
    city: string,
    venue: string,
    category: string
}

function App() {

    const [activities, setActivities] = useState([]);

    useEffect(() => {
        axios.get('https:localhost:5001/api/activities').then((res) => {
            console.log(res);
            setActivities(res.data);
        })
    }, [])

  return (
      <div>
        <Header as="h2" icon="users" content="Reactivities" />
        <List>
            {activities.map((activity: Activity) => 
                <List.Item key={activity.id}>
                {activity.title}
                </List.Item>
            )}
        </List>
    </div>
  );
}

export default App;