import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import PlayerActionsDropdown from './PlayerActionsDropdown';

const PlayerCardView = ({ 
  players, 
  onEdit, 
  onDelete, 
  apiService 
}) => {
  return (
    <Row className="g-4">
      {players.map(player => (
        <Col key={player.id} xs={12} sm={6} md={4} lg={3}>
          <div className="position-relative">
            <Link 
              to={`/player/${player.id}`} 
              className="text-decoration-none player-card"
            >
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <h5 className="card-title text-primary mb-3">{player.Name}</h5>
                  <div className="d-flex justify-content-center gap-2 mb-3">
                    <Badge bg="secondary">{player.Gender}</Badge>
                    <Badge bg="info">Age {player.age}</Badge>
                  </div>
                </Card.Body>
              </Card>
            </Link>
            <PlayerActionsDropdown
              player={player}
              onEdit={onEdit}
              onDelete={onDelete}
              apiService={apiService}
            />
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default PlayerCardView;
