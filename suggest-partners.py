#!/usr/bin/env python3
"""
Partner Suggestion Engine for TBWA Lunch & Learn System

This script analyzes the partner database and provides intelligent suggestions
based on various factors: vertical balance, industry trends, client relevance, etc.
"""

import json
import sys
from datetime import datetime
from collections import Counter
from typing import List, Dict, Any

def load_json(filepath: str) -> Dict:
    """Load JSON data from file."""
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: {filepath} not found")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in {filepath}")
        sys.exit(1)

def save_json(filepath: str, data: Dict) -> None:
    """Save JSON data to file."""
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

def analyze_vertical_distribution(partners: List[Dict]) -> Dict[str, int]:
    """Analyze how partners are distributed across verticals."""
    verticals = [p['vertical'] for p in partners]
    return dict(Counter(verticals))

def suggest_by_vertical(vertical: str, partners: List[Dict], limit: int = 5) -> List[Dict]:
    """Suggest partners in a specific vertical."""
    filtered = [p for p in partners if p['vertical'] == vertical]

    # Prioritize by status: Researching > Contacted > others
    priority_order = {
        'Researching': 1,
        'Contacted': 2,
        'In Conversation': 3,
        'Scheduled': 4,
        'Follow-Up Needed': 5,
        'Completed': 6,
        'Declined': 7
    }

    filtered.sort(key=lambda x: priority_order.get(x['status'], 99))

    suggestions = []
    for partner in filtered[:limit]:
        suggestions.append({
            'company': partner['company'],
            'status': partner['status'],
            'priority': _calculate_priority(partner),
            'reasoning': _generate_reasoning(partner),
            'tags': partner['tags']
        })

    return suggestions

def suggest_to_balance_verticals(partners: List[Dict], events: List[Dict], limit: int = 5) -> List[Dict]:
    """Suggest partners to balance vertical distribution."""
    # Count completed L&Ls by vertical
    completed_partners_ids = [e['partnerId'] for e in events if e['status'] == 'Completed']
    completed_verticals = []

    for partner in partners:
        if partner['id'] in completed_partners_ids:
            completed_verticals.append(partner['vertical'])

    vertical_counts = Counter(completed_verticals)

    # Find underrepresented verticals
    all_verticals = set(p['vertical'] for p in partners)
    underrepresented = sorted(all_verticals, key=lambda v: vertical_counts.get(v, 0))

    suggestions = []
    for vertical in underrepresented:
        candidates = [p for p in partners if p['vertical'] == vertical and p['status'] != 'Completed']
        if candidates:
            best = max(candidates, key=lambda x: _calculate_priority(x))
            suggestions.append({
                'company': best['company'],
                'vertical': vertical,
                'priority': _calculate_priority(best),
                'reasoning': f"Balance vertical distribution - only {vertical_counts.get(vertical, 0)} {vertical} L&Ls completed",
                'tags': best['tags'],
                'status': best['status']
            })

        if len(suggestions) >= limit:
            break

    return suggestions

def suggest_urgent_opportunities(partners: List[Dict], limit: int = 5) -> List[Dict]:
    """Suggest partners marked as urgent or high priority."""
    urgent = []

    for partner in partners:
        # Check for urgent tags or high-priority keywords in notes
        is_urgent = False
        priority_score = 0

        if any(tag in ['Current Priority', 'Urgent', 'High Priority'] for tag in partner.get('tags', [])):
            is_urgent = True
            priority_score += 3

        notes_lower = partner.get('notes', '').lower()
        if any(word in notes_lower for word in ['urgent', 'asap', 'priority', 'director wants']):
            is_urgent = True
            priority_score += 2

        if 'Emerging Tech' in partner.get('tags', []):
            priority_score += 1

        if is_urgent and partner['status'] != 'Completed':
            urgent.append({
                'company': partner['company'],
                'priority_score': priority_score,
                'reasoning': _generate_reasoning(partner),
                'tags': partner['tags'],
                'status': partner['status'],
                'next_action': partner.get('nextAction', 'TBD')
            })

    urgent.sort(key=lambda x: x['priority_score'], reverse=True)
    return urgent[:limit]

def suggest_by_client_relevance(client_keywords: List[str], partners: List[Dict], limit: int = 5) -> List[Dict]:
    """Suggest partners relevant to specific client keywords."""
    suggestions = []

    for partner in partners:
        if partner['status'] == 'Completed':
            continue

        relevance_score = 0
        matching_keywords = []

        # Check notes and tags for keyword matches
        searchable_text = f"{partner.get('notes', '')} {' '.join(partner.get('tags', []))}".lower()

        for keyword in client_keywords:
            if keyword.lower() in searchable_text:
                relevance_score += 1
                matching_keywords.append(keyword)

        if relevance_score > 0:
            suggestions.append({
                'company': partner['company'],
                'relevance_score': relevance_score,
                'matching_keywords': matching_keywords,
                'reasoning': f"Relevant to: {', '.join(matching_keywords)}",
                'vertical': partner['vertical'],
                'status': partner['status']
            })

    suggestions.sort(key=lambda x: x['relevance_score'], reverse=True)
    return suggestions[:limit]

def _calculate_priority(partner: Dict) -> int:
    """Calculate priority score for a partner."""
    score = 0

    # Tags-based scoring
    high_priority_tags = ['Current Priority', 'Urgent', 'Core Platform', 'Emerging Tech']
    for tag in partner.get('tags', []):
        if tag in high_priority_tags:
            score += 2

    # Status-based scoring
    if partner['status'] == 'Researching':
        score += 1
    elif partner['status'] == 'Contacted':
        score += 3
    elif partner['status'] == 'In Conversation':
        score += 5

    # Notes-based scoring
    notes_lower = partner.get('notes', '').lower()
    if 'urgent' in notes_lower or 'asap' in notes_lower:
        score += 3
    if 'director wants' in notes_lower:
        score += 2

    return score

def _generate_reasoning(partner: Dict) -> str:
    """Generate reasoning for why this partner is suggested."""
    reasons = []

    # Check tags
    if 'Current Priority' in partner.get('tags', []):
        reasons.append("Current priority")
    if 'Core Platform' in partner.get('tags', []):
        reasons.append("Essential platform for agency")
    if 'Emerging Tech' in partner.get('tags', []):
        reasons.append("Emerging technology opportunity")
    if 'LA-Based' in partner.get('tags', []):
        reasons.append("LA-based (easier coordination)")

    # Check notes for specific insights
    notes = partner.get('notes', '')
    if 'announced' in notes.lower():
        reasons.append("Recent announcement/launch")

    if not reasons:
        reasons.append(f"{partner['vertical']} partner")

    return "; ".join(reasons)

def main():
    """Main function to run partner suggestions."""
    # Load data
    partners_data = load_json('data/partner-database.json')
    events_data = load_json('data/events-log.json')

    partners = partners_data['partners']
    events = events_data['events']

    print("=" * 60)
    print("TBWA LUNCH & LEARN - PARTNER SUGGESTION ENGINE")
    print("=" * 60)
    print()

    # 1. Urgent Opportunities
    print("🔥 URGENT OPPORTUNITIES")
    print("-" * 60)
    urgent = suggest_urgent_opportunities(partners)
    if urgent:
        for i, sugg in enumerate(urgent, 1):
            print(f"{i}. {sugg['company']}")
            print(f"   Status: {sugg['status']}")
            print(f"   Priority: {sugg['priority_score']}/10")
            print(f"   Reasoning: {sugg['reasoning']}")
            print(f"   Next Action: {sugg['next_action']}")
            print()
    else:
        print("No urgent opportunities at this time.\n")

    # 2. Balance Verticals
    print("\n⚖️  BALANCE VERTICAL DISTRIBUTION")
    print("-" * 60)
    balance = suggest_to_balance_verticals(partners, events)
    if balance:
        for i, sugg in enumerate(balance, 1):
            print(f"{i}. {sugg['company']} ({sugg['vertical']})")
            print(f"   Reasoning: {sugg['reasoning']}")
            print(f"   Status: {sugg['status']}")
            print()
    else:
        print("Verticals are well balanced.\n")

    # 3. Vertical Distribution Overview
    print("\n📊 CURRENT VERTICAL DISTRIBUTION")
    print("-" * 60)
    distribution = analyze_vertical_distribution(partners)
    for vertical, count in sorted(distribution.items(), key=lambda x: x[1], reverse=True):
        print(f"  {vertical}: {count} partners")
    print()

    # 4. Status Overview
    print("\n📈 PARTNERSHIP STATUS OVERVIEW")
    print("-" * 60)
    status_counts = Counter(p['status'] for p in partners)
    for status, count in sorted(status_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {status}: {count}")
    print()

if __name__ == "__main__":
    main()
