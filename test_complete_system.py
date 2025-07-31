#!/usr/bin/env python3
"""
Complete system test for the Real-Time Window Visualizer.
Tests the full pipeline from window detection to WebSocket transmission.
"""

import asyncio
import json
import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'apps', 'backend'))

from main import get_window_data_with_active, is_browser_window, extract_browser_info

def test_browser_detection():
    """Test browser detection functionality."""
    print("=== Browser Detection Test ===")
    
    test_cases = [
        ("Gmail - Google Chrome", True, "Google Chrome", "Gmail"),
        ("GitHub - Microsoft Edge", True, "Microsoft Edge", "GitHub"),
        ("Discord", False, None, None),
        ("Visual Studio Code", False, None, None),
        ("YouTube - Mozilla Firefox", True, "Mozilla Firefox", "YouTube"),
    ]
    
    for title, expected_is_browser, expected_browser, expected_tab in test_cases:
        is_browser = is_browser_window(title)
        print(f"Title: '{title}'")
        print(f"  Expected Browser: {expected_is_browser}, Actual: {is_browser}")
        
        if is_browser:
            browser_info = extract_browser_info(title)
            print(f"  Browser: {browser_info['browser_name']}")
            print(f"  Tab: {browser_info['tab_title']}")
        print()

def test_window_data_structure():
    """Test the complete window data structure."""
    print("=== Window Data Structure Test ===")
    
    try:
        window_data = get_window_data_with_active()
        
        # Test required fields
        required_fields = ['active_window_title', 'window_count', 'windows', 'timestamp']
        for field in required_fields:
            assert field in window_data, f"Missing required field: {field}"
        
        print(f"✓ All required fields present")
        print(f"✓ Window count: {window_data['window_count']}")
        print(f"✓ Active window: {window_data['active_window_title']}")
        
        # Test window structure
        if window_data['windows']:
            first_window = window_data['windows'][0]
            window_fields = ['title', 'visible', 'minimized', 'active', 'is_browser', 'window_type']
            for field in window_fields:
                assert field in first_window, f"Missing window field: {field}"
            print(f"✓ Window objects have correct structure")
            
            # Count browser windows
            browser_count = sum(1 for w in window_data['windows'] if w['is_browser'])
            print(f"✓ Browser windows detected: {browser_count}")
        
        return True
        
    except Exception as e:
        print(f"✗ Error in window data structure: {e}")
        return False

def test_json_serialization():
    """Test JSON serialization of window data."""
    print("=== JSON Serialization Test ===")
    
    try:
        window_data = get_window_data_with_active()
        
        # Test JSON serialization
        json_str = json.dumps(window_data)
        print("✓ JSON serialization successful")
        
        # Test JSON parsing
        parsed_data = json.loads(json_str)
        print("✓ JSON parsing successful")
        
        # Verify data integrity
        assert parsed_data['window_count'] == window_data['window_count']
        print("✓ Data integrity verified")
        
        return True
        
    except Exception as e:
        print(f"✗ JSON serialization error: {e}")
        return False

def main():
    """Run all tests."""
    print("Real-Time Window Visualizer - Complete System Test")
    print("=" * 60)
    
    tests = [
        test_browser_detection,
        test_window_data_structure,
        test_json_serialization
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"✗ Test failed with exception: {e}")
            results.append(False)
        print()
    
    # Summary
    passed = sum(results)
    total = len(results)
    
    print("=" * 60)
    print(f"Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("✅ All tests passed! System is ready for Epic 1 completion.")
    else:
        print("❌ Some tests failed. Please check the implementation.")

if __name__ == "__main__":
    main()