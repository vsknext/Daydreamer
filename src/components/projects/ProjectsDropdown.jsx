import { nanoid } from "nanoid";
import { useContext } from "react";
import styles from "@/styles/projectsDropdown.module.scss";
import Truncate from "react-truncate";
import { If, Then, Else, When } from "react-if";
import { useRouter } from "next/router";

import ProjectOption from "@/src/components/projects/ProjectOption";

import { ProjectsContext } from "@/src/context/projects/ProjectsContext";

export default function ProjectsDropdown({ isDropdownOpen, setDropdown }) {
  const router = useRouter();
  const { projects, createProject } = useContext(ProjectsContext);
  const selectedProject = projects.find(
    (project) => project._id == router.query.id
  );
  const projectsOptions = projects.map((project, i) => (
    <ProjectOption project={project} projectIndex={i} key={project._id} />
  ));

  const createHandler = () => {
    createProject({ _id: nanoid(), name: "" });
  };

  return (
    <>
      <div
        className={isDropdownOpen ? styles.rootOpened : styles.root}
        onClick={() => setDropdown(!isDropdownOpen)}
      >
        <Truncate lines={1} width={185}>
          {selectedProject.name}
        </Truncate>
        <If condition={isDropdownOpen}>
          <Then>
            <img src="/img/arrowUp.svg" alt=" " />
          </Then>
          <Else>
            <img src="/img/arrowDown.svg" alt=" " />
          </Else>
        </If>
      </div>
      <When condition={isDropdownOpen}>
        <div
          className={styles.wrap}
          onClick={() => setDropdown(!isDropdownOpen)}
        ></div>
        <div className={styles.triangle}></div>
        <div className={styles.wrapOptions}>
          {projectsOptions}
          <div className={styles.newProject} onClick={createHandler}>
            + New Project
          </div>
        </div>
      </When>
    </>
  );
}
