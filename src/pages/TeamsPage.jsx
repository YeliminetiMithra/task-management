import React, { useState, useEffect } from "react";
import TeamList from "../team/TeamList";
import TeamForm from "../team/TeamForm";
import TeamMembersGrid from "../team/TeamMembersGrid";


export default function TeamsPage() {
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [teamInfo, setTeamInfo] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    if (!selectedTeamId) return;
    getTeamDetails(selectedTeamId).then((data) => {
      setTeamInfo(data.main);
      setTeamMembers(data.members);
    });
  }, [selectedTeamId]);

  return (
    <div className="teams-page">
      <h1>Team Management</h1>
      <TeamList onSelect={setSelectedTeamId} />
      {selectedTeamId && (
        <>
          <TeamForm formData={teamInfo} setFormData={setTeamInfo} />
          <TeamMembersGrid members={teamMembers} />
        </>
      )}
    </div>
  );
}
