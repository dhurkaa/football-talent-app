import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpDown,
  CalendarDays,
  Database,
  ExternalLink,
  Filter,
  Globe2,
  MapPin,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import {
  getInitialKosovoPlayerData,
  getKosovoPlayerData,
} from "../services/kosovoPlayers";
import { UEFA_SQUAD_SOURCE } from "../data/kosovoSquad";

const POSITION_FILTERS = ["All", "Goalkeeper", "Defender", "Midfielder", "Forward"];

const SORT_OPTIONS = [
  { value: "impact", label: "Squad impact" },
  { value: "age", label: "Youngest" },
  { value: "goals", label: "Goals" },
  { value: "name", label: "Name" },
];

const normalize = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const formatNumber = (value) => Number(value || 0).toLocaleString();

const initials = (name = "") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatDateTime = (value) =>
  new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function PlayerImage({ player }) {
  const [failed, setFailed] = useState(false);

  if (!player.image || failed) {
    return <div className="kosovo-avatar">{initials(player.fullName)}</div>;
  }

  return (
    <img
      className="kosovo-player-image"
      src={player.image}
      alt={player.fullName}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function StatTile({ icon: Icon, label, value, tone = "blue" }) {
  return (
    <div className={`kosovo-stat-tile ${tone}`}>
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function KosovoLive() {
  const [dataset, setDataset] = useState(getInitialKosovoPlayerData);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState("All");
  const [sort, setSort] = useState("impact");
  const [u23Only, setU23Only] = useState(false);
  const [selectedId, setSelectedId] = useState("fisnik-asllani");
  const [refreshing, setRefreshing] = useState(false);

  const refreshData = useCallback(async (force = false) => {
    setRefreshing(true);
    const nextDataset = await getKosovoPlayerData({ force });
    setDataset(nextDataset);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    refreshData(false);
  }, [refreshData]);

  const players = dataset.players;

  const metrics = useMemo(() => {
    const seniorSquad = players.filter((player) => player.isSeniorSquad);
    const totalGoals = seniorSquad.reduce(
      (sum, player) => sum + Number(player.goals || 0),
      0
    );
    const averageAge = seniorSquad.length
      ? seniorSquad.reduce((sum, player) => sum + Number(player.age || 0), 0) /
        seniorSquad.length
      : 0;
    const u23 = seniorSquad.filter((player) => Number(player.age) <= 23).length;

    return {
      squadSize: seniorSquad.length,
      totalGoals,
      averageAge: averageAge.toFixed(1),
      u23,
    };
  }, [players]);

  const filteredPlayers = useMemo(() => {
    const text = normalize(query);

    return players
      .filter((player) => position === "All" || player.positionGroup === position)
      .filter((player) => !u23Only || Number(player.age) <= 23)
      .filter((player) => {
        if (!text) return true;
        return [
          player.fullName,
          player.positionGroup,
          player.positionDetail,
          player.birthPlace,
          ...(player.clubs || []),
        ]
          .filter(Boolean)
          .some((value) => normalize(value).includes(text));
      })
      .sort((a, b) => {
        if (sort === "age") return Number(a.age || 99) - Number(b.age || 99);
        if (sort === "goals") return Number(b.goals || 0) - Number(a.goals || 0);
        if (sort === "name") return a.fullName.localeCompare(b.fullName);

        const impactA =
          Number(a.appearances || 0) * 2 +
          Number(a.goals || 0) * 5 +
          (a.isSeniorSquad ? 6 : 0);
        const impactB =
          Number(b.appearances || 0) * 2 +
          Number(b.goals || 0) * 5 +
          (b.isSeniorSquad ? 6 : 0);
        return impactB - impactA;
      });
  }, [players, position, query, sort, u23Only]);

  const selectedPlayer =
    players.find((player) => player.id === selectedId) || filteredPlayers[0] || players[0];

  const positionCounts = useMemo(
    () =>
      POSITION_FILTERS.slice(1).reduce((acc, item) => {
        acc[item] = players.filter(
          (player) => player.isSeniorSquad && player.positionGroup === item
        ).length;
        return acc;
      }, {}),
    [players]
  );

  return (
    <div className="page kosovo-live-page">
      <section className="kosovo-hero">
        <div className="kosovo-hero-copy">
          <span className="kosovo-kicker">
            <Globe2 size={16} />
            Kosovo live player board
          </span>
          <h1>Kosovo Player Intelligence</h1>
          <p>
            A scout-ready view of Kosovo's official UEFA squad, enriched with live
            public player facts from Wikidata.
          </p>

          <div className="kosovo-source-row">
            <a href={UEFA_SQUAD_SOURCE.url} target="_blank" rel="noreferrer">
              UEFA squad source
              <ExternalLink size={14} />
            </a>
            <span>{UEFA_SQUAD_SOURCE.accessedLabel}</span>
          </div>
        </div>

        <div className="kosovo-live-status" aria-label="Live source status">
          <span className={dataset.error ? "source-dot warning" : "source-dot"} />
          <div>
            <strong>{dataset.error ? "Official data mode" : "Live enriched"}</strong>
            <small>
              {dataset.error
                ? dataset.error
                : `${formatNumber(dataset.liveCount)} Wikidata records, ${
                    dataset.fromCache ? "cached" : "fresh"
                  } ${formatDateTime(dataset.fetchedAt)}`}
            </small>
          </div>
          <button
            type="button"
            className="icon-btn"
            title="Refresh live public data"
            onClick={() => refreshData(true)}
            disabled={refreshing}
          >
            <RefreshCw size={18} className={refreshing ? "spinning" : ""} />
          </button>
        </div>
      </section>

      <section className="kosovo-stats-grid" aria-label="Kosovo squad metrics">
        <StatTile icon={Users} label="Senior Squad" value={metrics.squadSize} />
        <StatTile icon={Sparkles} label="U23 Players" value={metrics.u23} tone="gold" />
        <StatTile icon={Target} label="Qualifying Goals" value={metrics.totalGoals} tone="red" />
        <StatTile icon={Activity} label="Average Age" value={metrics.averageAge} tone="green" />
      </section>

      <section className="kosovo-controls">
        <div className="search-field">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search player, club, birthplace"
          />
        </div>

        <div className="position-tabs" aria-label="Filter by position">
          {POSITION_FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              className={position === item ? "active" : ""}
              onClick={() => setPosition(item)}
            >
              {item}
              {item !== "All" && <span>{positionCounts[item] || 0}</span>}
            </button>
          ))}
        </div>

        <label className="u23-toggle">
          <input
            type="checkbox"
            checked={u23Only}
            onChange={(event) => setU23Only(event.target.checked)}
          />
          U23 only
        </label>

        <label className="sort-select">
          <ArrowUpDown size={17} />
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="kosovo-content-grid">
        <div className="kosovo-player-list">
          <div className="kosovo-list-header">
            <div>
              <span>
                <Filter size={15} />
                {filteredPlayers.length} players shown
              </span>
              <h2>Player Pool</h2>
            </div>
          </div>

          <div className="kosovo-card-grid">
            {filteredPlayers.map((player) => (
              <article
                className={`kosovo-player-card ${
                  selectedPlayer?.id === player.id ? "selected" : ""
                }`}
                key={player.id}
              >
                <div className="kosovo-card-top">
                  <PlayerImage player={player} />
                  <div>
                    <span className={`position-chip ${player.positionGroup.toLowerCase()}`}>
                      {player.positionGroup}
                    </span>
                    <h3>{player.fullName}</h3>
                    <p>{player.positionDetail || player.positionGroup}</p>
                  </div>
                </div>

                <div className="kosovo-mini-stats">
                  <div>
                    <span>Age</span>
                    <strong>{player.age || "-"}</strong>
                  </div>
                  <div>
                    <span>MP</span>
                    <strong>{player.appearances ?? "-"}</strong>
                  </div>
                  <div>
                    <span>{player.positionGroup === "Goalkeeper" ? "GA" : "G"}</span>
                    <strong>
                      {player.positionGroup === "Goalkeeper"
                        ? player.goalsAgainst ?? "-"
                        : player.goals ?? "-"}
                    </strong>
                  </div>
                </div>

                <div className="kosovo-card-foot">
                  <span>{player.clubs?.[0] || player.birthPlace || player.sourceType}</span>
                  <button type="button" onClick={() => setSelectedId(player.id)}>
                    Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="kosovo-detail-panel">
          {selectedPlayer && (
            <>
              <div className="detail-photo-wrap">
                <PlayerImage player={selectedPlayer} />
              </div>

              <span className={`position-chip ${selectedPlayer.positionGroup.toLowerCase()}`}>
                {selectedPlayer.positionGroup}
              </span>
              <h2>{selectedPlayer.fullName}</h2>
              <p className="detail-subtitle">
                #{selectedPlayer.shirtNumber || "-"}{" "}
                {selectedPlayer.isSeniorSquad ? "Kosovo senior squad" : "Kosovo player pool"}
              </p>

              <div className="detail-metric-row">
                <div>
                  <span>Age</span>
                  <strong>{selectedPlayer.age || "-"}</strong>
                </div>
                <div>
                  <span>MP</span>
                  <strong>{selectedPlayer.appearances ?? "-"}</strong>
                </div>
                <div>
                  <span>Goals</span>
                  <strong>{selectedPlayer.goals ?? "-"}</strong>
                </div>
              </div>

              <div className="detail-facts">
                <div>
                  <CalendarDays size={17} />
                  <span>{selectedPlayer.dateOfBirth || "Date of birth unavailable"}</span>
                </div>
                <div>
                  <MapPin size={17} />
                  <span>{selectedPlayer.birthPlace || "Birthplace unavailable"}</span>
                </div>
                <div>
                  <Shield size={17} />
                  <span>
                    {selectedPlayer.clubs?.length
                      ? selectedPlayer.clubs.join(", ")
                      : "Club data unavailable"}
                  </span>
                </div>
                <div>
                  <Database size={17} />
                  <span>{selectedPlayer.sourceType}</span>
                </div>
              </div>

              <div className="detail-actions">
                {selectedPlayer.sourceUrl && (
                  <a href={selectedPlayer.sourceUrl} target="_blank" rel="noreferrer">
                    Official source
                    <ExternalLink size={14} />
                  </a>
                )}
                {selectedPlayer.wikidataUrl && (
                  <a href={selectedPlayer.wikidataUrl} target="_blank" rel="noreferrer">
                    Wikidata
                    <ExternalLink size={14} />
                  </a>
                )}
                {selectedPlayer.wikipediaUrl && (
                  <a href={selectedPlayer.wikipediaUrl} target="_blank" rel="noreferrer">
                    Wikipedia
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </>
          )}
        </aside>
      </section>

      <section className="kosovo-position-band">
        {Object.entries(positionCounts).map(([item, count]) => (
          <div key={item}>
            <UserRound size={18} />
            <span>{item}</span>
            <strong>{count}</strong>
          </div>
        ))}
        <div>
          <Trophy size={18} />
          <span>Coach</span>
          <strong>Franco Foda</strong>
        </div>
      </section>
    </div>
  );
}

export default KosovoLive;
