import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Badge } from "react-bootstrap";
import PlayerActionsDropdown from "./PlayerActionsDropdown";

// Type definitions
interface Player {
  id: number;
  name?: string;
  Name: string;
  gender?: string;
  Gender: string;
  age: number;
}

interface ApiService {
  deletePlayer: (id: number) => Promise<any>;
}

interface PlayerCardViewProps {
  players: Player[];
  onEdit: (player: any) => void;
  onDelete: (playerId: number) => void;
  apiService: ApiService;
}

const PlayerCardView: React.FC<PlayerCardViewProps> = ({
  players,
  onEdit,
  onDelete,
  apiService,
}) => {
  return (
    <Row className="g-4">
      {players.map((player: Player) => (
        <Col key={player.id} xs={12} sm={6} md={4} lg={3}>
          <div className="position-relative">
            <Link
              to={`/player/${player.id}`}
              className="text-decoration-none player-card"
            >
              <Card className="h-100 border-0">
                <Card.Body className="text-center">
                  <h5 className="card-title text-primary mb-3">
                    {player.Name}
                  </h5>
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
