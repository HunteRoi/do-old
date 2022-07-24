import dayjs from 'dayjs';

import { ChoiceStatusEnum, Event } from '../models';

const getEventStats = (event: Event) => {
    const numberOfParticiants = event.attendanceData[0].attendeesChoices.length;
    const bestSpot = event.attendanceData.reduce((seed, current) => {
        const ratioGoing = current.attendeesChoices.filter(ac => ac.status === ChoiceStatusEnum.GOING).length;
        const ratioMaybe = current.attendeesChoices.filter(ac => ac.status === ChoiceStatusEnum.MAYBE).length / 2;
        const ratio = ratioGoing + ratioMaybe;

        if (seed.ratio < ratio) {
            seed.ratio = ratio;
            seed.date = current.date.toMillis();
        }

        return seed;
    }, { ratio: 0, date: 0 });
    const bestDate = bestSpot.ratio <= 1 ? 'No date yet' : dayjs(bestSpot.date).format('dddd DD/MM/YYYY');

    return { numberOfParticiants, bestDate };
};

export default getEventStats;