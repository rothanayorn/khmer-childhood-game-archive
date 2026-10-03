import styles from "./EntryForm.module.css";

// The ten field rows shared by the Create Entry form and the Edit Entry form.
// Pure rendering — the owning form passes the current values plus an onChange
// callback, and handles photo selection, busy state, and errors itself.
export default function EntryFields({ values, onChange, onPhotoChange, previewUrl }) {
  return (
    <>
      <label className={styles.label}>
        Name in Khmer
        <input
          className={styles.input}
          type="text"
          value={values.nameKhmer}
          onChange={(event) => onChange("nameKhmer", event.target.value)}
          maxLength={120}
        />
      </label>

      <label className={styles.label}>
        Name in English
        <input
          className={styles.input}
          type="text"
          value={values.nameEnglish}
          onChange={(event) => onChange("nameEnglish", event.target.value)}
          maxLength={120}
        />
      </label>

      <label className={styles.label}>
        Tagline
        <span className={styles.optional}>(optional)</span>
        <input
          className={styles.input}
          type="text"
          value={values.tagline}
          onChange={(event) => onChange("tagline", event.target.value)}
          maxLength={200}
        />
      </label>

      <label className={styles.label}>
        Description
        <textarea
          className={styles.textarea}
          rows={5}
          value={values.description}
          onChange={(event) => onChange("description", event.target.value)}
          maxLength={1500}
        />
      </label>

      <label className={styles.label}>
        How to play / Steps
        <span className={styles.optional}>one step per line, in order</span>
        <textarea
          className={styles.textarea}
          rows={8}
          value={values.stepsText}
          onChange={(event) => onChange("stepsText", event.target.value)}
          placeholder={
            "One step per line, in the order you play them.\nExample:\nPlayers line up in a circle.\nOne player is chosen to be 'it'."
          }
        />
      </label>

      <label className={styles.label}>
        Players
        <input
          className={styles.input}
          type="text"
          value={values.players}
          onChange={(event) => onChange("players", event.target.value)}
          maxLength={200}
        />
      </label>

      <label className={styles.label}>
        Materials
        <input
          className={styles.input}
          type="text"
          value={values.materials}
          onChange={(event) => onChange("materials", event.target.value)}
          maxLength={200}
        />
      </label>

      <label className={styles.label}>
        Contributor name
        <input
          className={styles.input}
          type="text"
          value={values.contributor}
          onChange={(event) => onChange("contributor", event.target.value)}
          maxLength={100}
        />
      </label>

      <label className={styles.label}>
        Place
        <input
          className={styles.input}
          type="text"
          value={values.place}
          onChange={(event) => onChange("place", event.target.value)}
          maxLength={100}
        />
      </label>

      <label className={styles.label}>
        Photo
        <span className={styles.optional}>one image up to 5 MB (no videos)</span>
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
          alt="Preview of the game photo"
          className={styles.preview}
        />
      )}
    </>
  );
}