import React from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { ViewSwitcher } from '@devexpress/dx-react-scheduler-material-ui';
import { Toolbar } from '@devexpress/dx-react-scheduler-material-ui';
import {
  Scheduler,
  WeekView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';


const Schedule = props => {
  const currentDate = new Date().toDateString();

  const [teacher, setTeacher] = React.useState( null );
  const scheduleGenerate = subs => {
    if( !subs ) return;
    const today = new Date();
    const first = today.getDate() - today.getDay() + 1;

    let monday = new Date(today.setDate( first ));
    const tempMonday = new Date( monday );
    const temp = [];

    subs.forEach( sub => {
      sub.days.forEach(( day, index ) => {
        const isDayActive = day;
        if( isDayActive ){
          monday.setDate( monday.getDate() + index );

          temp.push({
            startDate: monday.toJSON().split('T')[0] + 'T' + sub.start,
            endDate: monday.toJSON().split('T')[0] + 'T' + sub.end,
            title: sub.name
          });

          monday = new Date( tempMonday );
        } 
      });
    });

    return temp;
  }

  const subjects = React.useMemo(() => teacher?.subjects, [teacher]);
  const schedulerData = React.useMemo(() => scheduleGenerate( subjects ), [subjects]);


  const getTeacherData = () => {
    Axios.get(`${window.API_BASE_ADDRESS}/master/get-single-user/type/teacher/id/${Cookies.get('userId')}`, window.requestHeader)
    .then( res => {
      setTeacher( res.data );
    })
    .catch( err => {
      throw err;
    });
  }

  React.useEffect(() => {
    getTeacherData();
  }, []);

  return(
    <Paper className="w-full h-full m-0">
      <Scheduler
        data={schedulerData}
        className="h-full"
      >
        <ViewState
          currentDate={currentDate}
        />
        <WeekView
          startDayHour={9}
          endDayHour={19}
        />
        <Appointments />
        <Toolbar/>
      </Scheduler>
    </Paper>
  );
}


export default Schedule;