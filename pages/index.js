import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  client,
  recommendProfiles,
  getPublications,
  searchProfiles,
} from "../api";


export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      const response = await client.query(recommendProfiles).toPromise();
      const profileData = await Promise.all(
        response.data.recommendedProfiles.map(async (profile) => {
          const pub = await client
            .query(getPublications, { id: profile.id, limit: 1 })
            .toPromise();
          profile.publication = pub.data.publications.items[0];
          return profile;
        })
      );
      setProfiles(profileData);
    } catch (err) {
      console.log("error fetching recommended profiles: ", err);
    }
  }

  return (
    <div>
      <div>
        {profiles.map((profile, index) => (
          <Link href={`/profile/${profile.id}`} key={index}>
            <a>
                
              <p>{profile.handle}</p>
              <p>{profile.publication?.metadata.content}</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

const blankPhotoStyle = {
  width: '52px',
  height: '52px',
  backgroundColor: 'black'
}
