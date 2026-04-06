import json
import os
from typing import List, Dict
from services.vector_store import VectorStore
import uuid


def load_portfolio_data() -> Dict:
    """Load portfolio data from JSON files"""
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    
    portfolio_data = {
        "profile": None,
        "experience": [],
        "projects": [],
        "skills": [],
        "education": [],
    }

    profile_file = os.path.join(data_dir, "profile.json")
    if os.path.exists(profile_file):
        with open(profile_file, "r") as f:
            portfolio_data["profile"] = json.load(f)
    
    # Load experience data
    experience_file = os.path.join(data_dir, "experience.json")
    if os.path.exists(experience_file):
        with open(experience_file, "r") as f:
            portfolio_data["experience"] = json.load(f)
    
    # Load projects data
    projects_file = os.path.join(data_dir, "projects.json")
    if os.path.exists(projects_file):
        with open(projects_file, "r") as f:
            portfolio_data["projects"] = json.load(f)
    
    # Load skills data
    skills_file = os.path.join(data_dir, "skills.json")
    if os.path.exists(skills_file):
        with open(skills_file, "r") as f:
            portfolio_data["skills"] = json.load(f)
    
    # Load education data
    education_file = os.path.join(data_dir, "education.json")
    if os.path.exists(education_file):
        with open(education_file, "r") as f:
            portfolio_data["education"] = json.load(f)
    
    return portfolio_data


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """Split text into chunks with overlap"""
    words = text.split()
    chunks = []
    
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        if i + chunk_size >= len(words):
            break
    
    return chunks


def prepare_documents(portfolio_data: Dict) -> tuple[List[str], List[Dict], List[str]]:
    """Prepare documents for vector store"""
    documents = []
    metadatas = []
    ids = []

    profile = portfolio_data.get("profile")
    if isinstance(profile, dict) and profile:
        profile_text = (
            f"Candidate profile: {profile.get('fullName', '')}. {profile.get('headline', '')}. "
            f"Location: {profile.get('location', '')}. {profile.get('contact', '')}. {profile.get('summary', '')}"
        ).strip()
        if profile_text:
            documents.append(profile_text)
            metadatas.append({"source": "profile", "chunk_index": 0})
            ids.append(f"profile_0_{uuid.uuid4().hex[:8]}")
    
    # Process experience
    for exp in portfolio_data.get("experience", []):
        exp_text = f"Experience: {exp.get('title', '')} at {exp.get('organisation', {}).get('name', '')} ({exp.get('date', '')}). {exp.get('description', '')}"
        chunks = chunk_text(exp_text)
        for i, chunk in enumerate(chunks):
            documents.append(chunk)
            metadatas.append({
                "source": "experience",
                "title": exp.get('title', ''),
                "organisation": exp.get('organisation', {}).get('name', ''),
                "date": exp.get('date', ''),
                "chunk_index": i
            })
            ids.append(f"exp_{exp.get('title', '')}_{i}_{uuid.uuid4().hex[:8]}")
    
    # Process projects
    for proj in portfolio_data.get("projects", []):
        desc = (proj.get("description") or "").strip()
        desc_part = f" {desc}" if desc else ""
        proj_text = f"Project: {proj.get('title', '')}.{desc_part} Technologies: {', '.join(proj.get('tags', []))}"
        chunks = chunk_text(proj_text)
        for i, chunk in enumerate(chunks):
            documents.append(chunk)
            metadatas.append({
                "source": "project",
                "title": proj.get('title', ''),
                "technologies": ', '.join(proj.get('tags', [])),
                "chunk_index": i
            })
            ids.append(f"proj_{proj.get('title', '')}_{i}_{uuid.uuid4().hex[:8]}")
    
    # Process skills
    skills_text = "Skills: "
    for skill_section in portfolio_data.get("skills", []):
        section_name = skill_section.get("sectionName", "")
        skills_list = [s.get("name", "") for s in skill_section.get("skills", [])]
        skills_text += f"{section_name}: {', '.join(skills_list)}. "
    
    if skills_text != "Skills: ":
        chunks = chunk_text(skills_text)
        for i, chunk in enumerate(chunks):
            documents.append(chunk)
            metadatas.append({
                "source": "skills",
                "chunk_index": i
            })
            ids.append(f"skills_{i}_{uuid.uuid4().hex[:8]}")
    
    # Process education
    for edu in portfolio_data.get("education", []):
        edu_text = f"Education: {edu.get('degree', '')} from {edu.get('institution', '')} ({edu.get('date', '')})"
        chunks = chunk_text(edu_text)
        for i, chunk in enumerate(chunks):
            documents.append(chunk)
            metadatas.append({
                "source": "education",
                "degree": edu.get('degree', ''),
                "institution": edu.get('institution', ''),
                "date": edu.get('date', ''),
                "chunk_index": i
            })
            ids.append(f"edu_{edu.get('degree', '')}_{i}_{uuid.uuid4().hex[:8]}")
    
    return documents, metadatas, ids


def ingest_data():
    """Main function to ingest portfolio data into vector store"""
    print("Loading portfolio data...")
    portfolio_data = load_portfolio_data()
    
    print("Preparing documents...")
    documents, metadatas, ids = prepare_documents(portfolio_data)
    
    print(f"Prepared {len(documents)} document chunks")
    
    print("Initializing vector store...")
    vector_store = VectorStore()
    
    # Clear existing data
    print("Clearing existing data...")
    vector_store.delete_all()
    
    # Add documents in batches
    batch_size = 100
    for i in range(0, len(documents), batch_size):
        batch_docs = documents[i:i + batch_size]
        batch_metas = metadatas[i:i + batch_size]
        batch_ids = ids[i:i + batch_size]
        
        print(f"Adding batch {i // batch_size + 1} ({len(batch_docs)} documents)...")
        vector_store.add_documents(batch_docs, batch_metas, batch_ids)
    
    print("Data ingestion complete!")


if __name__ == "__main__":
    ingest_data()



