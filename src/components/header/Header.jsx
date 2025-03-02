import { useContext } from "react";
import styles from "@/styles/header.module.scss";
import { If, Then, Else } from "react-if";
import Truncate from "react-truncate";
import { useRouter } from "next/router";
import { nanoid } from "nanoid";

import { ViewSwitcher } from "@/src/components/viewSwitcher/viewSwitcher";

import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";
import { TasksContext } from "@/src/context/tasks/TasksContext";

export default function Header({ setMenu, setView, isMenuOpen, setModal }) {
  const router = useRouter();

  const userCtx = useContext(UsersContext);
  const { projectByQueryId, createProject } = useContext(ProjectsContext);
  const { createTask, tasksByProjectId } = useContext(TasksContext);

  const copyAndEdit = async () => {
    if (userCtx._id) {
      setMenu(false);
      const newProjectId = nanoid();
      await createProject({
        _id: newProjectId,
        name: projectByQueryId.name,
        owner: userCtx._id,
      });
      const new_ids = tasksByProjectId.map((t) => nanoid());
      const old_ids = tasksByProjectId.map((t) => t._id);

      const newTasks = tasksByProjectId.map((t) => {
        const i = tasksByProjectId.indexOf(t);
        if (t.root) {
          return {
            ...t,
            _id: new_ids[i],
            project: newProjectId,
            owner: userCtx._id,
            root: new_ids[old_ids.indexOf(t.root)],
          };
        } else {
          return {
            ...t,
            _id: new_ids[i],
            project: newProjectId,
            owner: userCtx._id,
          };
        }
      });

      async function createTasks() {
        const promises = newTasks.map(async (task) => {
          await createTask(task);
        });
        await Promise.all(promises);
      }
      await createTasks();

      router.push(`/gantt/${newProjectId}`);
      setTimeout(() => router.reload(), 100);
    } else {
      setModal("signup");
    }
  };

  return (
    <div className={styles.header}>
      <ViewSwitcher
        isMenuOpen={isMenuOpen}
        onViewModeChange={(viewMode) => setView(viewMode)}
      />
      <div className={styles.buttonsContainer}>
        <If condition={projectByQueryId.owner == userCtx._id}>
          <Then>
            <button
              className={styles.share_button}
              onClick={setModal.bind(null, "share")}
            >
              Share Project
            </button>
            <button
              className={styles.account_button}
              onClick={setModal.bind(null, "account")}
            >
              <img src="/img/avatar.svg" alt=" " />{" "}
              <Truncate lines={1} width={100}>
                {userCtx.name}
              </Truncate>
            </button>
          </Then>
          <Else>
            <button className={styles.share_button} onClick={copyAndEdit}>
              Copy and Edit
            </button>
          </Else>
        </If>
      </div>
    </div>
  );
}
