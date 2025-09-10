import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Badge, Button } from 'react-bootstrap';
import PlayerActionsDropdown from './PlayerActionsDropdown';

const PlayerTableView = ({ 
  players, 
  onEdit, 
  onDelete, 
  apiService 
}) => {
  return (
    <div className="player-table-container">
      <div className="table-responsive">
        <Table striped hover className="align-middle">
          <thead className="table-primary">
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
              <tr key={player.id}>
                <td>
                  <Link 
                    to={`/player/${player.id}`} 
                    className="text-decoration-none fw-bold text-primary"
                  >
                    {player.Name}
                  </Link>
                </td>
                <td>
                  <Badge bg="secondary">{player.Gender}</Badge>
                </td>
                <td>
                  <Badge bg="info">Age {player.age}</Badge>
                </td>
                <td className="text-center">
                  <PlayerActionsDropdown
                    player={player}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    apiService={apiService}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default PlayerTableView;
