import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Curriculum() {
  const navigate = useNavigate();
  const params = useParams();
  
  useEffect(() => {
    // Redirect to the subjects sub-page
    if (params.department) {
      navigate(`/department/${params.department}/curriculum/subjects`);
    } else {
      navigate("/curriculum/subjects");
    }
  }, [navigate, params.department]);

  return null;
}