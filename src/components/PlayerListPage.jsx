import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useData } from '../context/DataContext';

const PlayerListPage = () => {
  const { players } = useData();

  return (
    <Container>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Players</h2>
              <p className="text-muted mb-0">Manage your team roster and track individual progress</p>
            </div>
            <div>
              <Badge bg="primary" pill className="fs-6">
                {players.length} {players.length === 1 ? 'Player' : 'Players'}
              </Badge>
            </div>
          </div>
        </Col>
      </Row>
      
      <Row className="g-4">
        {players.map(player => (
          <Col key={player.id} xs={12} sm={6} md={4} lg={3}>
            <Link 
              to={`/player/${player.id}`} 
              className="text-decoration-none player-card"
            >
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <h5 className="card-title text-primary mb-3">{player.Name}</h5>
                  <div className="d-flex justify-content-center gap-2 mb-2">
                    <Badge bg="secondary">{player.Gender}</Badge>
                    <Badge bg="info">Age {player.age}</Badge>
                  </div>
                  <p className="text-muted small mb-0">
                    Age Group: {player.ageRange}
                  </p>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
      
      {players.length === 0 && (
        <Row>
          <Col>
            <div className="alert alert-warning text-center" role="alert">
              <h4 className="alert-heading">No Players Found</h4>
              <p className="mb-0">Please check the players.csv file.</p>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default PlayerListPage;
