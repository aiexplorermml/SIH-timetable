import { useParams } from "react-router-dom";
import { departments } from "../../data/departments";

export function useDepartment() {
  const params = useParams();
  // Extract department from URL - could be 'department' param or hardcoded 'aiml' from path
  const departmentId = params.department || (window.location.pathname.includes('/aiml/') ? 'aiml' : undefined);
  
  const currentDepartment = departments.find(dept => dept.id === departmentId);
  
  return {
    departmentId,
    currentDepartment,
    departments,
    isDepartmentView: !!departmentId,
  };
}