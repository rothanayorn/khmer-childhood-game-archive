import { useI18n } from "./I18nProvider";
import styles from "./EntryForm.module.css";

// The ten field rows shared by the Create Entry form and the Edit Entry form.
// Pure rendering — the owning form passes the current values plus an onChange
// callback, and handles photo selection, busy state, and errors itself.
export default function EntryFields({ values, onChange, onPhotoChange, previewUrl, photoRequired = true }) {
  const { t } = useI18n();
  return (
    <>
      <label className={styles.label}>
        <span className={styles.labelText}>
          {t("field.nameKhmer")} <span className={styles.required}>*</span>
        </span>
        <input
          className={styles.input}
          type="text"
          value={values.nameKhmer}
          onChange={(event) => onChange("nameKhmer", event.target.value)}
          maxLength={120}
        />
      </label>

      <label className={styles.label}>
        <span className={styles.labelText}>
          {t("field.nameEnglish")} <span className={styles.required}>*</span>
        </span>
        <input
          className={styles.input}
          type="text"
          value={values.nameEnglish}
          onChange={(event) => onChange("nameEnglish", event.target.value)}
          maxLength={120}
        />
      </label>

      <label className={styles.label}>
        <span className={styles.labelText}>{t("field.tagline")}</span>
        <span className={styles.optional}>{t("field.taglineOptional")}</span>
        <input
          className={styles.input}
          type="text"
          value={values.tagline}
          onChange={(event) => onChange("tagline", event.target.value)}
          maxLength={200}
        />
      </label>

      <label className={styles.label}>
        <span className={styles.labelText}>
          {t("field.description")} <span className={styles.required}>*</span>
        </span>
        <textarea
          className={styles.textarea}
          rows={5}
          value={values.description}
          onChange={(event) => onChange("description", event.target.value)}
          maxLength={1500}
        />
      </label>

      <label className={styles.label}>
        <span className={styles.labelText}>
          {t("field.steps")} <span className={styles.required}>*</span>
        </span>
        <span className={styles.optional}>{t("field.stepsHint")}</span>
        <textarea
          className={styles.textarea}
          rows={8}
          value={values.stepsText}
          onChange={(event) => onChange("stepsText", event.target.value)}
          placeholder={t("field.stepsPlaceholder")}
        />
      </label>

      <label className={styles.label}>
        <span className={styles.labelText}>
          {t("field.players")} <span className={styles.required}>*</span>
        </span>
        <input
          className={styles.input}
          type="text"
          value={values.players}
          onChange={(event) => onChange("players", event.target.value)}
          maxLength={200}
        />
      </label>

      <label className={styles.label}>
        <span className={styles.labelText}>
          {t("field.materials")} <span className={styles.required}>*</span>
        </span>
        <input
          className={styles.input}
          type="text"
          value={values.materials}
          onChange={(event) => onChange("materials", event.target.value)}
          maxLength={200}
        />
      </label>

      <label className={styles.label}>
        <span className={styles.labelText}>
          {t("field.contributor")} <span className={styles.required}>*</span>
        </span>
        <input
          className={styles.input}
          type="text"
          value={values.contributor}
          onChange={(event) => onChange("contributor", event.target.value)}
          maxLength={100}
        />
      </label>

      <label className={styles.label}>
        <span className={styles.labelText}>
          {t("field.place")} <span className={styles.required}>*</span>
        </span>
        <input
          className={styles.input}
          type="text"
          value={values.place}
          onChange={(event) => onChange("place", event.target.value)}
          maxLength={100}
        />
      </label>

      <label className={styles.label}>
        <span className={styles.labelText}>
          {t("field.photo")}
          {photoRequired && <span className={styles.required}>*</span>}
        </span>
        <span className={styles.optional}>{t("field.photoHint")}</span>
        <input
          type="file"
          accept="image/*"
          onChange={onPhotoChange}
          className={styles.file}
        />
      </label>

      {previewUrl && (
        <img
          src={previewUrl}
          alt={t("field.photoPreview")}
          className={styles.preview}
        />
      )}
    </>
  );
}