import { useContext, useEffect, useState } from "preact/hooks";
import { Param } from "../../General/Param/Param";
import styles from "./TitleBar.module.css";
import { InfoContext } from "../../../managers/info";
import { PlaceContext } from "../../../managers/place";
import { config } from "../../../config";
import { Snowflake } from "../../Snow/Snowflake/Snowflake";
import { Icon } from "../../General/Icon/Icon";

export function TitleBar() {
	const info = useContext(InfoContext);
	const place = useContext(PlaceContext);
	const [_infoIntervalId, setInfoIntervalId] = useState<NodeJS.Timeout>();
	const [opened, setOpened] = useState<boolean>(false);
	const [show, setShow] = useState<boolean>(false);

	useEffect(() => {
		info.fetch();

		setInfoIntervalId(setInterval(info.fetch, config.time.update.info));

		setTimeout(() => {
			setShow(true);
		}, 1000);
	}, []);

	if (info.info.value === null || place.image.value === null) {
		return null;
	}

	const isFinished = info.info.value.ended;

	const name = info.info.value.name === "season:blank" ? "Без названия" : info.info.value.name;
	const icon = isFinished ? "🏁" : "⚔️";

	const click = () => {
		setOpened(!opened);
	};

	return (
		<div className={`${styles.window} ${opened ? styles.opened : styles.closed}`} onClick={click}>
			<label for={styles.window} className={styles.title}>
				{name} {icon}
			</label>
			<div className={styles.content}>
				{show && (
					<div className={styles.container}>
						<div className={styles.params}>
							<Param label="Кулдаун" value={info.info.value.cooldown + "мс"} />
							<Param label="Размер" value={place.image.value.size.x + "x" + place.image.value.size.y} />
							<Param label="Онлайн" value={info.info.value.online.toString()} />
						</div>
						<div className={styles.icons}>
							<div className={styles.media}>
								{Object.entries(config.media).map(([name, url]) => (
									<a href={url[0]} target="_blank" rel="noopener noreferrer" key={name}>
										<Icon icon={name} alt={url[1]} size={35} viewBoxSize={256} />
										{/* <img src={`/images/icons/${name}.svg`} alt={name} width={35} height={35}/> */}
									</a>
								))}
							</div>
							<Snowflake />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
