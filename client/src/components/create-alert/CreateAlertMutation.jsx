import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Alert from './Alert';

const CreateAlertMutation = gql`
    mutation CreateAlert($category: String!, $EventId: Int, $latitude: Float!, $longitude: Float!, $notes: String, $photo: String, $photoTag: String) {
      createAlert(EventId: $EventId, category: $category, latitude: $latitude, longitude: $longitude, notes: $notes, url: $photo, photoTag: $photoTag ) {
        id
        category
        createdAt
        url
      }
    }
    `;

const CreateAlertWithMutation = graphql(CreateAlertMutation)(Alert);

export default CreateAlertWithMutation;
