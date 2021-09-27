import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Item, ItemContent, ItemDescription, ItemExtra, ItemHeader, ItemMeta, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

export default observer(function ActivityList(){

  const {activityStore} = useStore();
  const {deleteActivity, activitiesByDate} = activityStore;
  
  const [target, setTarget] = useState('');

  function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string){
    setTarget(e.currentTarget.name);
    deleteActivity(id);
  }

  return(
    <Segment>
      <Item.Group divided>
        {activitiesByDate.map(activity => (
          <Item key={activity.id}>
            <ItemContent>
              <ItemHeader as='a'>{activity.title}</ItemHeader>
              <ItemMeta>{activity.date}</ItemMeta>
              <ItemDescription>
                <div>{activity.description}</div>
                <div>{activity.city}, {activity.venue}</div>
              </ItemDescription>
              <ItemExtra>
                <Label basic content={activity.category} />
                <Button 
                  as={Link}
                  to={`/activities/${activity.id}`}
                  floated='right' 
                  content='View' 
                  color='blue'
                ></Button>
                <Button 
                  loading={activityStore.loading && target === activity.id} 
                  onClick={(e) => handleActivityDelete(e, activity.id)} 
                  floated='right' 
                  basic 
                  content='Delete' 
                  color='red'
                  name={activity.id}
                ></Button>
              </ItemExtra>
            </ItemContent>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  )
})